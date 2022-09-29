var plugin =function (options) {
    var seneca = this
// add, get  and delete
    seneca.add({ role:'product', cmd: 'add'}, function(msg, respond){
        this.make('product').data$(msg.data).save$(respond)
    })

    seneca.add({role:'product', cmd: 'get-all'}, function (msg, respond){
        this.make('product').list$({}, respond)
    })

    // delete all sequencially
   /* seneca.add({role:'product', cmd:'delete-all'}, function(msg,respond){
        this.make('product').remove$({},respond)
    })*/
}

module.export = plugin

var seneca = require("seneca")()
seneca.use(plugin)
seneca.use('seneca-entity')

seneca.add('role:api, cmd:add-product', function (args, done) {
    console.log("--> cmd:add-product")
    var product = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product))
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg)
        done(err, msg)
    })
})

seneca.add('role:api, cmd:get-all-products', function (args, done) {
    console.log("--> cmd:get-all-products")
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg)
        done(err, msg)
    })
})
