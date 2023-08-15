const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],

    address:[
         {
            name:{
                type: String
               
            },
        
            mobile:{
                type: Number
               
            },
        
            addressLine:{
                type: String
               
            },
        
            email:{
                type: String
               
            },
        
            state:{
                type: String
               
            },
        
            pincode:{
                type: Number
               
            },
        
            is_default:{
                type:Boolean
               
            }

         }
    ]
})


module.exports = mongoose.model('user',userSchema)