const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const auth = require('../middleware/authMiddleWare');


router.get("/:id", auth, invoiceController.getInvoiceDetails);

router.post("/:id/payments", auth, invoiceController.addPayment);

router.post("/archive", auth, invoiceController.archiveInvoice);

router.post("/restore", auth, invoiceController.restoreInvoice);

router.get("/:id/export", auth, invoiceController.exportInvoiceExcel);

router.get("/", auth, invoiceController.getAllInvoices);

router.post("/", auth, invoiceController.createInvoice);


module.exports = router;