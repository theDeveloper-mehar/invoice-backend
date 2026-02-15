const InvoiceLine = require("../models/InvoiceLine");
const Payment = require("../models/Payment");
const Invoice =  require("../models/Invoice");

const calculateInvoiceTotals = async (invoiceId)=>
{
    const lines = await InvoiceLine.find({invoiceId});
    const payments = await Payment.find({invoiceId});

    const total = lines.reduce((sum,item)=>sum+item.lineTotal,0);
    const amountPaid = payments.reduce((sum,p)=>sum+p.amount,0);
    const balanceDue = total - amountPaid;

    const status = balanceDue === 0 ? "PAID" : "DRAFT";

    await Invoice.findByIdAndUpdate(invoiceId,{
        total,
        amountPaid,
        balanceDue,
        status
    });

    return { total , amountPaid , balanceDue , status};
};

module.exports = calculateInvoiceTotals;