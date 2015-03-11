var CoMws = require('comws');
var mws = new CoMws();

mws.use(function *(next){
    this.result += ' hello';
    yield next();
});

mws.use(function *(next){
    this.result += ' world';
    yield next();
});

var ctx = {result:'yet another'};

mws.run(ctx).then(function(){
  console.log(ctx.result);
});