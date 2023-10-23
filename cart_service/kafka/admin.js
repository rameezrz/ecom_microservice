const {kafka} = require('./client')

exports.init = async()=>{
    const admin = kafka.admin()
    await admin.connect()
    console.log("Admin Connected");
    await admin.createTopics({
        topics:[{
            topic:'cart_to_product',
            topic:'add_to_cart'
        }]
    })

    await admin.disconnect()
}