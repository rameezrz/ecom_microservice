const {kafka} = require('./client')

exports.init = async()=>{
    const admin = kafka.admin()

    await admin.connect()
    console.log("Order service Admin Connected");

    await admin.createTopics({
        topics:[{
            topic:'product_to_order',
            topic:'add_to_cart_return'
        }]
    })

    await admin.disconnect()
}