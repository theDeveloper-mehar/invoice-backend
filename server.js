const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

//seed function
const seedInvoice = require("./utils/seedInvoice");


const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/invoices",require("./routes/invoiceRoutes"));
app.use("/api/auth",require("./routes/authRoutes"));


const createSeller = async()=>
{
    const existingSeller = await User.findOne({email:"seller@gmail.com"});
    if(!existingSeller)
    {
        const hashedPassword = await bcrypt.hash('seller123',10);

        await User.create({
            email:"seller@gmail.com",
            password:hashedPassword,
            role:"SELLER"
        });
        console.log('default seller created');
    }
};


mongoose.connect(process.env.MONGO_URL)
.then(async ()=>
{
    console.log("MongoDB Connected");
    await createSeller();

    //seedfunction calling
    await seedInvoice();

    app.listen(process.env.PORT,()=>
    {
        console.log(`Server running on port ${process.env.PORT}`)
    });
})
.catch((err)=>console.log(err));

