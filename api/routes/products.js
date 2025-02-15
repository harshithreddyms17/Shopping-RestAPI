const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/products');
const router = express.Router();
router.get('/',(req,res,next)=>{
    const finalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response={
            count: docs.length,
            products: docs.map(doc=>{
                    return{
                        name: doc.name,
                        price: doc.price,
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
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
    )
})
router.post('/',(req,res,next)=>{
    console.log(req.file);
    const product= new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
    product
    .save()
    .then(result =>{
        console.log(result);
        const finalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${result._id}`;
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'POST',
                    url: finalUrl
                }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
    
});
router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc=>{
        const response={
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request:{
                type: 'GET',
                url: "http://localhost:3000/products"
            }
        }
        if(doc){
            res.status(200).json(response);
        }
        else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
});
router.patch('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id:id},{$set: updateOps})
    .exec()
    .then(result=>{
        const finalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${result._id}`;
        res.status(200).json({
            message:'Product updated',
            request:{
                type:'GET',
                url: finalUrl
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});
router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Product deleted",
            requests:{
                type:'DELETE',
                url: "http://localhost:3000/products",
                body:{
                    name: 'String',
                    price: 'Number'
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