const {kafka} = require('./client')


const cartProducer = async(message)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic:'cart_to_product',
        messages:[{
            key:'user-cart',
            value:message
        }]
    })
    console.log("User cart sent to product service");
    await producer.disconnect()
}

module.exports = {cartProducer}