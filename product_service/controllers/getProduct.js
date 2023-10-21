const Product = require("../models/productModel");
const amqp = require("amqplib/callback_api");

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "No Matching product Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Found matching product",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

const productIdPromise = new Promise((resolve, reject) => {
  amqp.connect("amqp://localhost", (err, conn) => {
    conn.createChannel((err, ch) => {
      const queueToReceive = "cart_to_product";
      ch.assertQueue(queueToReceive, { durable: false });
      console.log("Waiting");
      ch.consume(
        queueToReceive,
        (msg) => {
          console.log(
            `received ${msg.content.toString()} from ${queueToReceive}`
          );
          const productId = msg.content.toString();
          resolve(productId);
        },
        { noAck: true }
      );
    });
  });
});

productIdPromise.then(async(productId) => {
  const product = await Product.findById(productId)
  console.log(product);
  amqp.connect('amqp://localhost',(err,conn)=>{
      conn.createChannel((err,ch)=>{
        const queueToSend = 'product_to_cart'
        const msg = JSON.stringify(product)
        ch.assertQueue(queueToSend,{durable:true})
        ch.sendToQueue(queueToSend,Buffer.from(msg))
        console.log(`Sent ${msg} to ${queueToSend}`);
      })
    })
});

module.exports = { getProduct };
