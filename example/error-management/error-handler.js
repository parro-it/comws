var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next){
    throw new Error('Yike!');
    
});


mws.use(function *(ctx, err, next){
    console.log(err.message);
    
});



mws.run();