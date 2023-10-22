const express = require('express')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const app = express()

//environment variables
dotenv.config({ path: "./.env" });
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

//db config
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Order DB Connection Successful"))
  .catch((e) => console.log("Error : ", e));

app.get('/orders',(req,res)=>res.send('order service'))

app.use('/orders',require('./routes/routes'))


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log("Order server running", PORT))

const {init} = require('./kafka/admin')
init()
