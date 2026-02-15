const Invoice = require("../models/Invoice");
const InvoiceLine = require("../models/InvoiceLine");

const seedInvoice = async () => {
  const existing = await Invoice.findOne({ invoiceNumber: "INV-001" });

  if (existing) {
    console.log("Sample invoice already exists");
    return;
  }

  const invoice = await Invoice.create({
    invoiceNumber: "INV-001",
    customerName: "John Doe",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "DRAFT",
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
    isArchived: false
  });

  await InvoiceLine.create([
    {
      invoiceId: invoice._id,
      description: "Website Design",
      quantity: 2,
      unitPrice: 500,
      lineTotal: 2 * 500
    },
    {
      invoiceId: invoice._id,
      description: "Hosting Service",
      quantity: 1,
      unitPrice: 200,
      lineTotal: 1 * 200
    }
  ]);

  console.log("Sample invoice created");
};

module.exports = seedInvoice;
