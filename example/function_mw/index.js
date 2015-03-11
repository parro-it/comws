
var CoMws = require('comws');
var mws = new CoMws();

mws.use(function (next){
    var _this = this;

    _this.result += '\n first at '+new Date().getTime();
    return next().then(function(){
        _this.result += '\n after second at ' + new Date().getTime();    
    });
    
});

mws.use(function *(next){
    this.result += '\n second running at ' + new Date().getTime();

    return new Promise(function(resolve){
        setTimeout(resolve,1000);    
    });
});

var ctx = {result:'start at ' + new Date().getTime()};

mws.run(ctx).then(function(){
  console.log(ctx.result);
});