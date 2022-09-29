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

