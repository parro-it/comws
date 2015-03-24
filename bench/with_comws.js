var CoMws = require('comws');

function sumNatural(i){
    return function *(next){
        this.result += i;
        yield next();
    };
}





export default function run() {
    var ctx = {result:0};

    var mws = new CoMws();

    for (var i=0; i<100; i++) {
        mws.use(sumNatural(i));
    }

    return mws.run(ctx).then(function(){
      return ctx.result;
    });
}
