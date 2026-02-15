/*
  Payment Model

  This defines the schema for invoice payments.

  Each payment stores:
  1) Invoice reference
  2) Amount
  3) Payment date
*/




const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    invoiceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Invoice",
        required:true
    },
    amount:
    {
        type:Number,
        required:true
    },
    paymentDate:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Payment",paymentSchema);