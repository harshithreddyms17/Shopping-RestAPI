const express = require('express');
const mongoose = require('mongoose');
const Orders = require('../models/orders');
const Product = require('../models/products');
const { request } = require('../../app');
const router = express.Router();
router.get('/',(req,res,next)=>{
    const finalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    Orders.find()
    .select('_id quantity productId')
    .populate('productId','_id name')
    .exec()
    .then(docs=>{
        console.log(docs);
        const response={
            count: docs.length,
            products: docs.map(doc=>{
                    return{
                        productId: doc.productId,
                        quantity: doc.quantity,
                        _id:doc._id,
                        request :{
                            type: "GET",
                            url: finalUrl
                        }
                    }
                }
            )
        };
        res.status(200).json(response);
    })
});
router.post('/',(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        const orders = new Orders({
            _id:new mongoose.Types.ObjectId(),
            productId:req.body.productId,
            quantity:req.body.quantity
        });
        return orders.save()
    })
    .then(result=>{
        console.log(result);
        const finalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${result._id}`;
        res.status(201).json({
            message:'Order stored',
            order: {
                productId: result.productId,
                quantity: result.quantity,
                _id: result._id,
                request:{
                    type:"POST",
                    url: finalUrl
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});
router.get('/:orderId',(req,res,next)=>{
    const id = req.params.orderId;
    Orders.findById(id)
    .select('_id quantity productId')
    .populate('productId','_id name price')
    .exec()
    .then(order=>{
        if(!order)
        {
            res.status(404).json({
                message: 'Order not found'
            })
            return;
        }
        res.status(200).json({
            order: order,
            request:{
                type:'GET',
                url: "http://localhost:3000/orders"
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
});
router.delete('/:orderId',(req,res,next)=>{
    const id = req.params.orderId;
    Orders.deleteOne({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Order deleted",
            requests:{
                type:'DELETE',
                url: "http://localhost:3000/orders",
                body:{
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports=router;