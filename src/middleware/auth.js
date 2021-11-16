const jwt = require('jsonwebtoken')
const Company = require('../models/company')
const Driver = require('../models/driver')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const decoded = jwt.verify(token, "DEPSTAR_19dce111_19dce146_19dce148");
        const company = await Company.findOne({ _id: decoded._id, 'tokens.token': token })
        const driver = await Driver.findOne({ _id: decoded._id, 'tokens.token': token })
        if (company) {
            req.email = company.company_email
        }
        else if(driver){
            req.email = driver.driver_name
        }
        else{
            req.email = '';
        }
        req.token = token
        next()        
    } catch (e) {
        res.status(401).render('index',{
            encodedJsonw : encodeURIComponent("Please Login or Signup")
        });
    }
}

module.exports = auth