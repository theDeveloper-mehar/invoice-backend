/* inovoice controller 
this controller handles all invoice-related operations:

1) create new invoice 
2) fetch all invoices 
3) fetch single invoice details
4) archive and restore invoice

*/



const Invoice = require("../models/Invoice");
const InvoiceLine = require("../models/InvoiceLine");
const Payment = require("../models/Payment");
const calculateInvoiceTotals = require("../utils/calculateTotals");
const ExcelJS = require('exceljs');

exports.getInvoiceDetails = async(req,res)=>
{
    try
    {
        const {id} = req.params;

        const invoice = await Invoice.findById(id);
        if(!invoice)
        {
            return res.status(404).json({message : "Invoice Not Fund"});
        }

        const lines =  await InvoiceLine.find({invoiceId:invoice._id});
        const payments = await Payment.find({invoiceId:invoice._id});

        const totals = await calculateInvoiceTotals(invoice._id);

        res.json({
            invoice,
            lineItems:lines,
            payments,
            total:totals.total,
            amountPaid : totals.amountPaid,
            balanceDue : totals.balanceDue
        });
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};

exports.addPayment = async (req,res) =>
{
    try
    {
        const { id} = req.params;
        const {amount} = req.body;

        if(!amount || amount <= 0)
        {
            return res.status(400).json({message:"Amount must be grater than 0"})
        }
        const invoice = await Invoice.findById(id);
        if(!invoice)
        {
            return res.status(404).json({message:"Invoice Not Found "})
        }

        if(amount > invoice.balanceDue)
        {
            return res.status(400).json({message:"Overpayment not allowed"});
        }

        await Payment.create({
            invoiceId:invoice._id,
            amount
        });
        const totals = await  calculateInvoiceTotals(invoice._id);

        res.json({
            message:"Payment Added Succesfully",
            total:totals.total,
            amountPaid:totals.amountPaid,
            balanceDue:totals.balanceDue,
            status:totals.status
        });
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, customerName, issueDate, dueDate, lineItems } = req.body;

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate)
    });

    for (let item of lineItems) {
      await InvoiceLine.create({
        invoiceId: invoice._id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice
      });
    }


    await calculateInvoiceTotals(invoice._id);

    res.status(201).json({ message: "Invoice created successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.archiveInvoice = async(req,res)=>
{
    try
    {
        const {id} = req.body;
        
        await Invoice.findByIdAndUpdate(id,{isArchived:true});
        res.json({message:"Invoice Archived Succesfully"});
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};

exports.restoreInvoice = async(req,res) =>
{
    try{
        const{id} = req.body;
        await Invoice.findByIdAndUpdate(id,{isArchived:false});
        res.json({message:"Invoice resotred successfully"});
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
};



exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.exportInvoiceExcel = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({invoiceNumber:id});
    const lines = await InvoiceLine.find({ invoiceId: invoice._id });
    const payments = await Payment.find({ invoiceId: invoice._id });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    worksheet.addRow(["Invoice Number", invoice.invoiceNumber]);
    worksheet.addRow(["Customer Name", invoice.customerName]);
    worksheet.addRow(["Issue Date", invoice.issueDate]);
    worksheet.addRow(["Due Date", invoice.dueDate]);
    worksheet.addRow([]);

    worksheet.addRow(["Description", "Quantity", "Unit Price", "Line Total"]);

    lines.forEach(line => {
      worksheet.addRow([
        line.description,
        line.quantity,
        line.unitPrice,
        line.lineTotal
      ]);
    });

    worksheet.addRow([]);
    worksheet.addRow(["Total", invoice.total]);
    worksheet.addRow(["Amount Paid", invoice.amountPaid]);
    worksheet.addRow(["Balance Due", invoice.balanceDue]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
