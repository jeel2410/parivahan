const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Order = require('./order')

const driverSchema = new mongoose.Schema({
    driver_name: {
        type: String,
        required: true,
        trim: true
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
    mobile_number: {
        type: String,
        unique: true,
        required: true,
        validate(value){
            
        }
    },
    adhaar_card:{
        type: String,
        required: true,
        length: 12,
        validate(value){
            
        }
    },
    vehicle_type:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            
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
driverSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'driver_side'
})

driverSchema.methods.toJSON = function () {
    const driver = this
    const driverObject = driver.toObject()

    delete driverObject.password
    delete driverObject.tokens
    delete driverObject.adhaar_card

    return driverObject
}

driverSchema.methods.generateAuthToken = async function () {
    const driver = this
    const token = jwt.sign({ _id: driver._id.toString() }, "DEPSTAR_19dce111_19dce146_19dce148")

    driver.tokens = driver.tokens.concat({ token })
    await driver.save()

    return token
}

driverSchema.statics.findByCredentials = async (mobile_number, password) => {
    const driver = await Driver.findOne({ mobile_number })

    if (!driver) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, driver.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return driver
}

// Hash the plain text password before saving
driverSchema.pre('save', async function (next) {
    const driver = this

    if (driver.isModified('password')) {
        driver.password = await bcrypt.hash(driver.password, 8)
    }

    next()
})

// // Delete user tasks when user is removed
// driverSchema.pre('remove', async function (next) {
//     const driver = this
//     await Order.deleteMany({ owner: user._id })
//     next()
// })


const Driver = mongoose.model('Driver', driverSchema)

module.exports = Driver