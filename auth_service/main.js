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
  .then(() => console.log("Connection Successful"))
  .catch((e) => console.log("Error : ", e));

app.get('/auth',(req,res)=>res.send('auth service'))

app.use('/auth', require('./routes/routes'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log("server running at ",PORT))
