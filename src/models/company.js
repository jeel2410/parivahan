const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Order = require('./order')

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    company_email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    address: {
        type: String,
        required: false,
        validate(value) {

        }
    },
    gstno:{
        type: String,
        length: 15,
        required: true,
        validate(value){

        }
    },
    mobile_number: {
        type: Number,
        required: true,
        validate(value){
            if(value.toString().length != 10){
                throw new Error('please enter mobileNumber')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // avatar:{
    //     type: Buffer
    // }
},{
    timestamps: true
})

companySchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'company_side'
})

companySchema.methods.toJSON = function () {
    const company = this
    const companyObject = company.toObject()

    delete companyObject.password
    delete companyObject.tokens
    delete companyObject.gstno

    return companyObject
}

companySchema.methods.generateAuthToken = async function () {
    const company = this
    const token = jwt.sign({ _id: company._id.toString() }, "DEPSTAR_19dce111_19dce146_19dce148")

    company.tokens = company.tokens.concat({ token })
    await company.save()

    return token
}

companySchema.statics.findByCredentials = async (email, password) => {
    const company = await Company.findOne({ email })

    if (!company) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, company.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return company
}

// Hash the plain text password before saving
companySchema.pre('save', async function (next) {
    const company = this

    if (company.isModified('password')) {
        company.password = await bcrypt.hash(company.password, 8)
    }

    next()
})

// // Delete user tasks when user is removed
// companySchema.pre('remove', async function (next) {
//     const company = this
//     await Order.deleteMany({ owner: user._id })
//     next()
// })

const Company = mongoose.model('Company', companySchema)

module.exports = Company