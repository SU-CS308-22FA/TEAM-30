const express= require('express');
const app= express();
require('dotenv/config');
const route=process.env.API_URL;
const usersRouter= require('./routers/users');
const productRouter= require('./routers/products');
const catRouter= require('./routers/categories');
const orderRouter= require('./routers/orders');

const authJwt = require('./helpers/jwt');
const errorHandler= require('./helpers/error-handler');
const morgan=require('morgan');
const mongoose= require('mongoose');
const cors = require('cors');


app.use(cors());
app.options('*',cors());

app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use(errorHandler);



app.use(`${route}/users`,usersRouter);
app.use(`${route}/products`,productRouter);
app.use(`${route}/categories`,catRouter);
app.use(`${route}/orders`,orderRouter);







mongoose.connect("mongodb+srv://ozanbasaran:Ozan1996@308proj.ur2hbuj.mongodb.net/308-Proj?retryWrites=true&w=majority")
.then(()=>{
    console.log('Database is connected');
})
.catch((err)=>{
    console.log(err);
})
app.listen(3000,()=>{
    console.log('listening canım');
})