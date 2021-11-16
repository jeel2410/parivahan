const mongoose = require('mongoose')
const validator = require('validator')

const orderSchema = new mongoose.Schema({
    company_side: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    company_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            
        }
    },
    mobile_number: {
        type: Number,
        required: true,
        validate(value){
            
        }
    },
    bid:{
        type: Boolean,
        default: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    pickup_address: {
        type: String,
        required: true,
        validate(value) {

        }
    },
    drop_address: {
        type: String,
        required: true,
        validate(value) {

        }
    },
    order_type: {
        type: String,
        required: true,
        validate(){

        }
    },
    driver_side: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Driver'
    },
    quentity:{
        type: Number,
        min: 2,
        max: 7,
        required: true,
        validate(value){

        }
    },
    rate:{
        type: Number,
        required: true,
        validate(value){

        }
    },
    date:{
        type: Date,
        required: true,
        validate(value){
            if(!validator.isDate(value)){
                throw new Error('enter valid Date')
            }
        }
    },
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order