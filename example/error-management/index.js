var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next){
    throw new Error('Yike!');
    
});



mws.run();