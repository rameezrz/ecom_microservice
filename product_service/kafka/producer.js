const {kafka} = require('./client')


const productProducer = async(message)=>{
    const producer = kafka.producer()
    await producer.connect()

    await producer.send({
        topic:'product_to_order',
        messages:[{
            key:'user-cart',
            value:message
        }]
    })
    console.log("User cart sent to product service");
    await producer.disconnect()
}

module.exports = {productProducer}