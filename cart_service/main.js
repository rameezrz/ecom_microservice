const express = require('express')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); 
const app = express()

//environment variables
dotenv.config({ path: "./.env" });

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

//db config
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Cart DB Connection Successful"))
  .catch((e) => console.log("Error : ", e));

  app.get(process.env.USER_BASE_URL,(req,res)=>res.send('Cart service'))

  app.use(process.env.USER_BASE_URL, require('./routes/userRoutes'))


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log("Cart server running", PORT))

const {init} = require('./kafka/admin.js')
init()

const { cartConsumer1,cartConsumer3 } = require('./kafka/consumer');

cartConsumer1(); 
cartConsumer3()

