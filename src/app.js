const path = require('path')
const hbs = require('hbs')
const express = require('express')
const mongoose = require('mongoose');
require('./db/mongoose')
const companyRouter = require('./routers/company')
const driverRouter = require('./routers/driver')
const orderRouter = require('./routers/order')
const auth = require('./middleware/auth');
const bidRouter = require('./routers/bid')
const cookieparser = require('cookie-parser');
const app = express()
const port = 3000
app.set('view engine','hbs')

app.use(express.static(path.join(__dirname,'../public')))
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(companyRouter)
app.use(driverRouter)
app.use(orderRouter);
app.use(bidRouter);

app.get('/index',auth,(req,res)=>{
    res.render('index',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/about',auth,(req,res)=>{
    res.render('about',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/contact',auth,(req,res)=>{
    res.render('contact',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/branch',auth,(req,res)=>{
    res.render('branch',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/login',(req,res)=>{
    res.render('login',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/register',(req,res)=>{
    res.render('register',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/service',auth,(req,res)=>{
    res.render('service',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/transport',auth,(req,res)=>{
    res.render('transport',{
        email: encodeURIComponent(req.email)
    });
})
app.get('/df',auth,(req,res)=>{
    res.render('about',{
        email: encodeURIComponent(req.email)
    });
})
app.get('*',auth,(req,res)=>{
    res.render('index',{
        email: encodeURIComponent(req.email)
    });
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
