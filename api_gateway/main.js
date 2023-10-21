const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); 
const app = express();

const authenticateToken = require('./utils/verifyUser')

dotenv.config({ path: "./.env" });

app.get('/', (req, res) => res.send('API Gateway'));

app.use(cookieParser());

const routes = {
  '/auth': 'http://localhost:4001',
  '/products': 'http://localhost:4002',
  '/cart': 'http://localhost:4003',
  '/order': 'http://localhost:4004',
};

for (const route in routes) {
  const target = routes[route];
  if(route !== '/auth'){
    app.use(route, authenticateToken ,createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }else{
    app.use(route, createProxyMiddleware({ target, changeOrigin: true, logLevel: 'debug' }));
  }
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`API GATEWAY running at ${PORT}`));
