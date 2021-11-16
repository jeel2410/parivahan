const express = require('express')
const Driver = require('../models/driver')
const driver_auth = require('../middleware/driver_auth')
const router = new express.Router()

router.post('/driver', async (req, res) => {
    console.log("we are here1")
    const driver = new Driver(req.body)
    console.log("we are here2")
    try {
        console.log("we are here3")
        await driver.save()
        console.log("we are here4")
        // sendingWelcomeEmail(user.email,user.name);
        const token = await driver.generateAuthToken()
        console.log("we are here5")
        // res.status(201).send({ driver,token })
        res.cookie("jwt",token);
        // res.status(201).send({ company,token })
        res.render('index',{
            encodedJsons : encodeURIComponent("Your account has been created"),
            email : encodeURIComponent(driver.driver_name)
        });
    } catch (e) {
        // res.status(400).send(e)
        res.status(400).render('register',{
            encodedJsonw : encodeURIComponent("Your account has been already created, try to login with this email!")
        });
    }
})

router.post('/driver_login', async (req, res) => {
    
    try {
        const driver = await Driver.findByCredentials(req.body.mobile_number, req.body.password)
        const token = await driver.generateAuthToken()
        // res.status(201).send({ driver, token })
        res.cookie("jwt",token);
        // res.status(201).send({ company, token })
        res.render('index',{
            encodedJsons : encodeURIComponent("Yor are Successfully loged in!"),
            email : encodeURIComponent(driver.driver_name)
        });
    } catch (e) {
        // res.status(400).send()
        res.render('login',{
            encodedJsonw : encodeURIComponent("Wrong Email or Password")
        });
    }
})

router.post('/driver_logout', driver_auth, async (req, res) => {
    try {
        req.driver.tokens = req.driver.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.driver.save()

        // res.send("driver has been logged out")
        res.render('index',{
            encodedJsons : encodeURIComponent("Yor are Successfully loged Out!")
        });
    } catch (e) {
        // res.status(500).send()
        res.status(500).render('index',{
            encodedJsonw : encodeURIComponent("Server Error!")
        });
    }
})

router.post('/driver_logoutAll', driver_auth, async (req, res) => {
    try {
        req.driver.tokens = []
        await req.driver.save()
        es.render('index',{
            encodedJsons : encodeURIComponent("Yor are Successfully loged Out! from all devices")
        });
    } catch (e) {
        res.status(500).render('index',{
            encodedJsonw : encodeURIComponent("Server Error!")
        });
    }
})

router.get('/driver/me', driver_auth, async (req, res) => {
    res.send(req.driver)
})

router.patch('/driver/me', driver_auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['driver_name','age','mobile_number', 'password', 'adhaar_card','vehicle_type','vehicle_capacity']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.driver[update] = req.body[update])
        await req.driver.save()
        res.send(req.driver)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/driver/me', driver_auth, async (req, res) => {
    try {
        await req.driver.remove()
        res.send(req.driver)
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = router