const { kafka } = require("./client");

const orderConsumer = async () => {
  return new Promise(async (resolve, reject) => {
    const consumer = kafka.consumer({ groupId: "group3" });
    await consumer.connect();
    console.log("consumer connected");
    await consumer.subscribe({
      topics: ["product_to_order"],
      fromBeginning: true,
    });
    console.log("consumer subscribed");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (message) {
          console.log("consumer got message");
          const products = JSON.parse(message.value.toString()); // Parse the message as JSON
          console.log(products);
          resolve(products);
        } else {
          reject("Received undefined message.");
        }
      },
    });
  });
};


module.exports = { orderConsumer };