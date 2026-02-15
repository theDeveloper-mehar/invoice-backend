/*
  Invoice Model

  This defines the MongoDB schema for invoices.

  It stores:
  1) Invoice number
  -2) Customer name
  3) Issue & due dates
  4) Status
  5) Archive flag

  Mongoose schema ensures proper data validation.
*/



const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber :{
            type:String,
            required:true,
            unique:true
        },
        customerName:
        {
            type:String,
            required:true
        },
        issueDate:{
            type:Date,
            required:true
        },
        dueDate:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            enum:["DRAFT",'PAID'],
            default:"DRAFT"
        },
        total:{
            type:Number,
            default:0
        },
        amountPaid:{
            type:Number,
            default:0
        },
        balanceDue:{
            type:Number,
            default:0
        },
        isArchived:{
            type:Boolean,
            default:false    
        }
    },
    {timestamps:true}
);
module.exports = mongoose.model("Invoice",invoiceSchema);
