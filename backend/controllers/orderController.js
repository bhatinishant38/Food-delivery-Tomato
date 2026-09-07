import { orderModel } from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend

export const placeOrder = async (req,res) =>{

    const frontend_url = "https://tomato-frontend-6ycb.onrender.com"

    try{
        const newOrder = new orderModel({
            userId : req.userId,
            items : req.body.items ,
            amount : req.body.amount ,
            address : req.body.address
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.userId ,{cartData : {}})

        const line_items = req.body.items.map((item)=>({
            price_data : {
                currency : 'inr',
                product_data : {
                    name : item.name
                },
                unit_amount : item.price*100*85
            },
            quantity : item.quantity
        }))

        line_items.push({
            price_data :{
                currency : "inr",
                product_data : {
                    name : " Delivery Charges"
                },
                unit_amount : 2*100*85
            },
            quantity : 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items : line_items ,
            mode : "payment",
            success_url : `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url : `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success : true , session_url : session.url})

    } catch(error){
        console.log(error)
         res.json({success : false ,message : "Error"})
    }

}


// verifying order
export const verifyOrder = async(req,res) =>{
    const {orderId ,success} = req.body
    try {
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId ,{payment : true})
            res.json({success : true ,message : "Paid"})

        } else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success : false,message : "Not Paid"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success : false , message : "error"}) 
    }
}

//user orders for frontend

export const userOrders = async (req,res)=>{
    try {
        const userId = req.body
        const orders = await orderModel.find(userId)
        console.log(orders)
        res.json({success : true , data : orders})

    } catch (error) {
        console.log(error);
        res.json({success : false , message : "error"})      
    }
}

// Listening orders for admin panel

export const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true ,data :orders})
        
    } catch (error) {
        console.log(error)
        res.json({success:false ,error : error})     
    }
}

// api for updating order status

export const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status : req.body.status})
       res.json({success : true , message : "Status Updated" })
    } catch (error) {
        console.log(error)
       res.json({success : false , message : "Error"})     
    }
}