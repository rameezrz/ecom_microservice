const { kafka } = require("./client");
const { productProducer } = require("./producer");
const Product = require("../models/productModel");

const { ObjectId } = require("mongoose").Types; // Import ObjectId from Mongoose

const productConsumer1 = async () => {
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
            const productObjectIds = productIds.map(
              ({ item }) => new ObjectId(item)
            );
            console.log("ProductObjectIds:", productObjectIds);

            // Fetch product details from the database
            const products = await Product.find({
              _id: { $in: productObjectIds },
            });
            console.log("Fetched products from the database:", products);

            // Create an array with product ID, quantity, and price
            const productsWithQuantities = productIds.map(
              ({ item, quantity }) => {
                const product = products.find((p) => p._id.toString() === item);
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
                    error: "Product not found",
                  };
                }
              }
            );

            // Send the productsWithQuantities array to the producer
            await productProducer(
              Buffer.from(JSON.stringify(productsWithQuantities)),"product_to_order"
            );

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

const productConsumer2 = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group4" });
    await consumer.connect();
    console.log("consumer connected");
    await consumer.subscribe({
      topics: ["add_to_cart"],
      fromBeginning: true,
    });
    console.log("consumer subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message) {
            console.log("Consumer got a message");
            const productId = message.value.toString(); // Parse the message as JSON
            console.log("Received productId:", productId);
            const product = await Product.findById(productId)
            console.log(product);
            await productProducer(Buffer.from(JSON.stringify(product)),'add_to_cart_return')
            console.log('add_to_cart_return sent');
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

const productConsumer3 = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group7" });
    await consumer.connect();
    console.log("consumer 7 connected");
    await consumer.subscribe({
      topics: ["order_created"],
      fromBeginning: true,
    });
    console.log("consumer 7 subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          if (message) {
            console.log("Consumer 7 got a message");
            const orderDetails = JSON.parse(message.value.toString())
            console.log(orderDetails);
            console.log('-------------------------------');
            const {products} = orderDetails
            const bulkOperations = products.map((product) => ({
              updateOne: {
                filter: { _id: product.productId },
                update: { $inc: { stock: -product.quantity } }, // Decrement stock by the specified quantity
              },
            }));
            await Product.bulkWrite(bulkOperations);
            console.log("stock decremented");
            console.log('-------------------------------');
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

module.exports = { productConsumer1, productConsumer2,productConsumer3 };
