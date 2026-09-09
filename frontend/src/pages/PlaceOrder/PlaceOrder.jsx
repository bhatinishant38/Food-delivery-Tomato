import React, { useContext, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/storeContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    // console.log(orderItems)
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  });
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={data.firstName}
            name="firstName"
            type="text"
            placeholder="First name"
            required
          />
          <input
            onChange={onChangeHandler}
            value={data.lastName}
            name="lastName"
            type="text"
            placeholder="Last name"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={data.email}
          name="email"
          type="email"
          placeholder="Email address"
          required
        />
        <input
          onChange={onChangeHandler}
          value={data.street}
          name="street"
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={data.city}
            name="city"
            type="text"
            placeholder="City"
            required
          />
          <input
            onChange={onChangeHandler}
            value={data.state}
            name="state"
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={data.zipcode}
            name="zipcode"
            type="text"
            placeholder="Zip code"
            required
          />
          <input
            onChange={onChangeHandler}
            value={data.country}
            name="country"
            type="text"
            placeholder="country"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={data.phone}
          name="phone"
          type="number"
          placeholder="Phone no."
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>$ {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivary fee</p>
              <p>$ {getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                $ {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
