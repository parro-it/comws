var koa = require('koa');


function sumNatural(i){
    return function *(next){
    //    process.stdout.write(i+', ');
        this.result += i;
        yield next;
    };
}

let app = koa();

var ctx = {result:0};

app.use(function *(next){
    this.result = 0;
    yield next;
});

for (var i=0; i<100; i++) {
    app.use(sumNatural(i));
}

app.use(function *(next){
    app.resolveTest(this.result);
});


export default function run() {
    let a = app;
    return new Promise((resolve, reject)=> {
        const fakedRes = {
            setHeader(){}

        };

        a.resolveTest = resolve;
        a.callback()({},fakedRes);
    });
}
