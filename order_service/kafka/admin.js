const {kafka} = require('./client')

exports.init = async()=>{
    const admin = kafka.admin()

    await admin.connect()
    console.log("Order service Admin Connected");

    await admin.createTopics({
        topics:[{
            topic:'order_to_cart',
            topic:'order_created'
        }]
    })

    await admin.disconnect()
}