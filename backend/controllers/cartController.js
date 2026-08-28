import {userModel }from '../models/userModel.js'

//add items to user cart

export const addToCart = async (req,res ,next)=>{
    const _id = req.userId
    try {
        let userData = await userModel.findById(_id)
        let cartData = await userData.cartData
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(_id ,{cartData})
        res.json({success : true , message : 'Added To Cart'})

    } catch(error){
        console.log(error)
        res.json({success : false , message : 'Error'})
    }
}

//remove items from user cart

export const removeFromCart = async (req,res,next)=>{
    const _id = req.userId
    try {
        let userData = await userModel.findById(_id)
        let cartData = await userData.cartData
        if(cartData[req.body.itemId]>0){
             cartData[req.body.itemId] -= 1
        }
        await userModel.findByIdAndUpdate(_id ,{cartData})
        res.json({success : true , message : 'Removed from Cart'})
    } catch(error) {
        console.log(error)
        res.json({success : false , message : 'Error'})
    }
}

// fetch  user cart data

export const fetchCart = async (req,res,next)=>{
    const _id = req.userId
    try{
         let userData = await userModel.findById(_id)
         let cartData = await userData.cartData
          res.json({success : true , cartData})
          
    } catch(error){
        console.log(error)
        res.json({success : false , message : 'Error'})
    }
}