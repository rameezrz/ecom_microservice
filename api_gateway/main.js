const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); 
const app = express();

const verifyUser = require('./utils/verifyUser')
const verifyAdmin = require('./utils/verifyAdmin')

dotenv.config({ path: "./.env" }); 
app.use(cookieParser());

const BASE_URL = '/api/v1'
const USER_URL = BASE_URL+'/users'
const ADMIN_URL = BASE_URL+'/admin'

app.get(`${USER_URL}`, (req, res) => res.send('API Gateway for Users'));
app.get(`${ADMIN_URL}`, (req, res) => res.send('API Gateway for Admin'));

const userRoutes = {
  [`${USER_URL}/auth`] : `http://localhost:4001`,
  [`${USER_URL}/products`]: 'http://localhost:4002',
  [`${USER_URL}/cart`]: 'http://localhost:4003',
  [`${USER_URL}/orders`]: 'http://localhost:4004',
};

const adminRoutes = {
  [`${ADMIN_URL}/auth`] : `http://localhost:4001`,
  [`${ADMIN_URL}/products`]: 'http://localhost:4002',
  [`${ADMIN_URL}/cart`]: 'http://localhost:4003',
  [`${ADMIN_URL}/orders`]: 'http://localhost:4004',
};

for (const route in userRoutes) {
  const target = userRoutes[route];
  if(route !== `${USER_URL}/auth`){
    app.use(route, verifyUser ,createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }else{
    app.use(route, createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }
}

for (const route in adminRoutes) {
  const target = adminRoutes[route];
  if(route !== `${ADMIN_URL}/auth`){
    app.use(route, verifyAdmin ,createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }else{
    app.use(route, createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`API GATEWAY running at ${PORT}`));
