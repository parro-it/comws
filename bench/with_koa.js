var koa = require('koa');


function sumNatural(i){
    return function *(next){
        this.result += i;
        yield next;
    };
}

var app = koa();

var ctx = {result:0};

app.use(function *(next){
    this.result = 0;
    yield next;
});

for (var i=0; i<100; i++) {
    app.use(sumNatural(i));
}

app.use(function *(next){
    this.body = this.result;
});

app.listen(3000);

export default function run() {
    return new Promise((resolve,reject)=>{
        var req = http.request('http://localhost:'+(3000), function(res) {
          if (res.statusCode !== 200) {
              return reject(new Error(res.statusCode));
          }

          res.on('data', function (chunk) {
            resolve(chunk);
            app.stop();
          });
          res.on('error', reject);
        });

        req.on('error', reject);

        req.end();

        setTimeout(reject,100);
    });
}
