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
seneca.act('role:web', {
    use: {
        prefix: '/products',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { GET: true, POST: true },
            'get-all-products': { GET: true, }
            
        }
    }
})

let countGET=0
let countPOST=0

function countRequests(req,res,next){
    if (req.method === "GET") countGET++
    if (req.method === "POST") countPOST++
    console.log(req.METHODS)
    console.log("GET count: " + countGET + " , POST count: " + countPOST)
    if(next)next()
}
var express = require('express');
var app = express();
app.use (countRequests)
app.use(require("body-parser").json())
app.use(seneca.export('web'))



app.listen(3009)
console.log("Server listening on localhost:3009 ...");
console.log("----- Requests -------------------------");
console.log("http://localhost:3009/products/add-product?product=Laptop&price=201.99&category=PC");
console.log("http://localhost:3009/products/get-all-products")
//console.log("http://localhost:3009/products/delete-all-products")
