const express = require('express')
const Order = require('../models/order')
const driver_auth = require('../middleware/driver_auth')
const router = new express.Router()

router.get('/driver_bids',driver_auth,async(req,res)=>{
    try {
        const bids = await Order.find({bid:true,completed:false});
        if(!bids){
            return res.status(404).send()
        }
        // res.send(bids)
        res.render('driver_transport',{
            data: bids,
            email: encodeURIComponent(req.driver.driver_name)
        })
    } catch (error) {
        res.status(500).send()
    }
})
router.post('/driver/accept_bid/:id',driver_auth,async(req,res)=>{
    const _id = req.params.id
    console.log("this is id ",_id)
    try{
        const order = await Order.findOne({_id,bid:true,completed:false});
        if(!order){
            return res.status(404).send()
        }
        order.bid = false
        order.completed = true
        order.driver_side = req.driver._id;

        // Order.findByIdAndUpdate(_id,{bid:false,completed:false,driver_side:req.driver._id});
        await order.save()
        const bids = await Order.find({bid:true,completed:false});
        if(!bids){
            return res.status(404).send()
        }
        // res.status(201).send(order)
        res.render('driver_transport',{
            data: bids,
            encodedJsons : encodeURIComponent("Your order has been Successfully placed"),
            email: encodeURIComponent(req.driver.driver_name)
        })
    }catch(error){
        res.status(500).send()
    }
})

module.exports = router