import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required :true
    },
    email : {
         type :String,
        required :true,
        unique : true
    },
    password : {
        type : String ,
        required : true
    },
    cartData : {
        type : Object,
        default :{}
    }
} ,{minimize :false})
// {minimize :false} this is required because we have not given any data in cartData , if we use this then the cartData entry is created without any data  


export const userModel = mongoose.model("user", userSchema);