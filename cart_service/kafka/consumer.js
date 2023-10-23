const { kafka } = require("./client");
const {cartProducer} = require('../kafka/producer')
const Cart = require('../models/cartModel')

const cartConsumer1 = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group1" });
    await consumer.connect();
    console.log("consumer connected");

    await consumer.subscribe({
      topics: ["order_to_cart"],
      fromBeginning: true,
    });
    console.log("consumer subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message) {
          console.log("consumer got message");
          const userId = message.value.toString()
          console.log(userId);
          const userCart = await Cart.findOne({userId})
          await Cart.updateOne({ userId }, { $set: { products: [] } });
          console.log(userCart);
          // Extract product IDs from userCart.products
          const productIds = userCart.products.map((product) => ({
            item: product.item,
            quantity: product.quantity
          }));          
          console.log(productIds);
          // Now, productIds contains an array of product IDs that you can send
          await cartProducer(Buffer.from(JSON.stringify(productIds)),'cart_to_product');
          console.log("Product IDs sent to product service");
          resolve(message.value.toString());
        } else {
          reject("Received undefined message.");
        }
      },
    });
  });
};

const cartConsumer2 = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group5" });
    await consumer.connect();
    console.log("consumer connected");

    await consumer.subscribe({
      topics: ["add_to_cart_return"],
      fromBeginning: true,
    });
    console.log("consumer subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message) {
          console.log("consumer got message");
          const productDetails = JSON.parse(message.value.toString())
          console.log(productDetails);
          console.log("add-to-cart-return got successful");
          resolve(productDetails);
        } else {
          reject("Received undefined message.");
        }
      },
    });
  });
};

module.exports = { cartConsumer1, cartConsumer2 };