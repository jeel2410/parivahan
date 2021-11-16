const express = require('express')
const Order = require('../models/order')
const company_auth = require('../middleware/company_auth')
const router = new express.Router()

router.post('/Order',company_auth,async (req, res) => {

    const order = new Order({
        ...req.body,
        company_side: req.company._id,
    })
    try {
        await order.save()
        // res.status(201).send(order)
        res.render('transport',{
            encodedJsons : encodeURIComponent("Your order has been booked"),
            email : encodeURIComponent(req.company.company_email)
        });
    } catch (e) {
        // res.status(400).send(e)
        console.log(e);
        res.render('transport',{
            encodedJsonw : encodeURIComponent("Something went wrong"),
            // email : encodeURIComponent(company.company_email)
        });
    }
})

module.exports = router