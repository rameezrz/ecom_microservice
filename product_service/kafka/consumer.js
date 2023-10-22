const { kafka } = require("./client");
const {productProducer} = require('./producer')
const Product = require('../models/productModel')

const { ObjectId } = require('mongoose').Types; // Import ObjectId from Mongoose

const productConsumer = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group2" });
    await consumer.connect();
    console.log("consumer connected");
    await consumer.subscribe({
      topics: ["cart_to_product"],
      fromBeginning: true,
    });
    console.log("consumer subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message) {
            console.log("Consumer got a message");
            const productIds = JSON.parse(message.value.toString()); // Parse the message as JSON
            console.log("Received productIds:", productIds);
    
            // Extract productObjectIds
            const productObjectIds = productIds.map(({ item }) => new ObjectId(item));
            console.log("ProductObjectIds:", productObjectIds);
    
            // Fetch product details from the database
            const products = await Product.find({ _id: { $in: productObjectIds } });
            console.log("Fetched products from the database:", products);
    
            // Create an array with product ID, quantity, and price
            const productsWithQuantities = productIds.map(({ item, quantity }) => {
              const product = products.find(p => p._id.toString() === item);
              if (product) {
                return {
                  productId: item,
                  quantity,
                  price: product.price,
                };
              } else {
                // Handle the case where a product ID in productIds doesn't exist in the database
                return {
                  productId: item,
                  quantity,
                  price: 0, // Set a default price or handle this as needed
                  error: 'Product not found',
                };
              }
            });
    
            // Send the productsWithQuantities array to the producer
            productProducer(Buffer.from(JSON.stringify(productsWithQuantities)));
    
            // Resolve the message with the fetched product details
            resolve(message.value.toString());
          } else {
            reject("Received undefined message.");
          }
        } catch (error) {
          console.error("Error processing message:", error);
          reject(error.message);
        }
      },
    });
        
  });
};


module.exports = { productConsumer };