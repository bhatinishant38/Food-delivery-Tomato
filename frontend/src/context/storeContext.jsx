import { createContext, useEffect, useState } from "react";
import axios from 'axios'


export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {

  const [ food_list ,setFoodList] = useState([])
  const [cartItems, setCartItems] = useState({});
  const url = 'https://backend-tomato-a3gv.onrender.com'
  const [token ,setToken] = useState('')

  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list")
    setFoodList(response.data.data)
  }

  const lordCartData = async (token) => {
     const response =  await axios.post(url+"/api/cart/fetch" ,{} ,{headers :{token}})
      setCartItems(response.data.cartData)
  }

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    }
    console.log("Token", token)
    console.log("Item Id", itemId)
    if(token){
      await axios.post(url+"/api/cart/add" ,{itemId} ,{headers :{token}})
      
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
       await axios.post(url+"/api/cart/remove" ,{itemId} ,{headers :{token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        let itemInfo = food_list.find((item) => item._id === key);
        totalAmount += itemInfo.price * cartItems[key];
      }
    }
    return totalAmount;
  };

 useEffect(()=>{  
    async function loadData() {
      await fetchFoodList()
        if(localStorage.getItem('token')){
          setToken(localStorage.getItem("token"))
          await lordCartData(localStorage.getItem("token"))
        }   
    }
        loadData()
  },[])


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
