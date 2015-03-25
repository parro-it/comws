var CoMws = require('../src/index');

function sumNatural(i){
    return function *(next){
        this.result += i;
        yield next();
    };
}


var mws = new CoMws('bb');

for (var i=0; i<100; i++) {
    mws.use(sumNatural(i));
}


export default function run() {
    var ctx = {result:0};

    return mws.run(ctx).then(function(){
      return ctx.result;
    });
}
