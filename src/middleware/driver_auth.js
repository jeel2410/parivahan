const jwt = require('jsonwebtoken')
const Driver = require('../models/driver')

const driver_auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        // const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, "DEPSTAR_19dce111_19dce146_19dce148");
        const driver = await Driver.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!driver) {
            throw new Error()
        }

        req.token = token
        req.driver = driver
        next()
    } catch (e) {
        // res.status(401).send({ error: 'Please authenticate.' })
        res.status(401).render('index',{
            encodedJsonw : encodeURIComponent("Please Login or Signup through driver account")
        });
    }
}

module.exports = driver_auth