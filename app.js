const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const orderRoutes=require('./api/routes/orders');
const productRoutes = require('./api/routes/products');

mongoose.connect('mongodb+srv://admin:harshith@cluster0.7uji5xg.mongodb.net/restdb?retryWrites=true&w=majority&appName=Cluster0');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON data
app.use(express.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if(req.method==='OPTIONS')
        {
           res.header("Access-Control-Allow-Methods","PUT,PATCH,GET,DELETE,POST");
           res.status(200).json({});
           return; 
        }
        next();
})
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use((req,res,next)=>{
    const error = new Error(`Not found in ${req.originalUrl}`);
    console.log("hi")
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error: error
    });
})


module.exports=app; 
