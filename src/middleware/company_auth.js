const jwt = require('jsonwebtoken')
const Company = require('../models/company')

const company_auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const decoded = jwt.verify(token, "DEPSTAR_19dce111_19dce146_19dce148");
        const company = await Company.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!company) {
            throw new Error()
        }

        req.token = token
        req.company = company
        next()
    } catch (e) {
        // res.status(401).send({ error: 'Please authenticate.' })
        res.status(401).render('index',{
            encodedJsonw : encodeURIComponent("Please Login or Signup through company account")
        });
    }
}

module.exports = company_auth