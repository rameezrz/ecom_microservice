const express = require('express')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express()

//environment variables
dotenv.config({ path: "./.env" });

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

//db config
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Product DB Connection Successful"))
  .catch((e) => console.log("Error : ", e));

app.get(process.env.USER_BASE_URL,(req,res)=>res.send('products service For Users'))
app.get(process.env.ADMIN_BASE_URL,(req,res)=>res.send('products service For Admin'))

app.use(process.env.USER_BASE_URL, require('./routes/userRoutes'))
app.use(process.env.ADMIN_BASE_URL, require('./routes/adminRoutes'))


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log("product server running", PORT))

const {init} = require('./kafka/admin')
init()
const {productConsumer1,productConsumer2,productConsumer3} = require('./kafka/consumer')
productConsumer1()
productConsumer2()
productConsumer3()
