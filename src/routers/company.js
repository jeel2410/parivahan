const express = require('express')
const Company = require('../models/company')
const company_auth = require('../middleware/company_auth')
const router = new express.Router()

router.post('/company', async (req, res) => {
    const company = new Company(req.body)
    try {
        await company.save()
        // sendingWelcomeEmail(user.email,user.name);
        const token = await company.generateAuthToken()
        res.cookie("jwt",token);
        // res.status(201).send({ company,token })
        res.render('index',{
            encodedJsons : encodeURIComponent("Your account has been created"),
            email : encodeURIComponent(company.company_email)
        });
    } catch (e) {
        // res.status(400).send(e)
        res.status(400).render('register',{
            encodedJsonw : encodeURIComponent("Your account has been already created, try to login with this email!")
        });
    }
})

router.post('/company_login', async (req, res) => {
    try {
        const company = await Company.findByCredentials(req.body.company_email, req.body.password)
        const token = await company.generateAuthToken()
        res.cookie("jwt",token);
        // res.status(201).send({ company, token })
        res.render('index',{
            encodedJsons : encodeURIComponent("Yor are Successfully loged in!"),
            email : encodeURIComponent(company.company_email)
        });
    } catch (e) {
        // res.status(400).send()
        res.render('login',{
            encodedJsonw : encodeURIComponent("Wrong Email or Password")
        });
    }
})

router.post('/company_logout', company_auth, async (req, res) => {
    try {
        req.company.tokens = req.company.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.company.save()

        // res.send("company_user has been logged out")
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

router.post('/company_logoutAll', company_auth, async (req, res) => {
    try {
        req.company.tokens = []
        await req.company.save()
        // res.send("Company_user has been logged out from all devices")
        res.render('index',{
            encodedJsons : encodeURIComponent("Yor are Successfully loged Out! from all devices")
        });
    } catch (e) {
        // res.status(500).send()
        res.status(500).render('index',{
            encodedJsonw : encodeURIComponent("Server Error!")
        });
    }
})

router.get('/company_me', company_auth, async (req, res) => {
    res.send(req.company)
})

router.patch('/company_me', company_auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['company_name', 'company_email', 'password', 'address','comapany_types','mobile_number']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        updates.forEach((update) => req.company[update] = req.body[update])
        await req.company.save()
        res.send(req.company)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/company_me', company_auth, async (req, res) => {
    try {
        await req.company.remove()
        res.send(req.company)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router