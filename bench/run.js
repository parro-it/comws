import comwsRun from './with_comws';
import koaRun from './with_koa';

import Benchmark from 'benchmark';
var benchCoMws = new Benchmark.Suite();

function makeBench(fnToRun,name){
    return new Benchmark({
        defer: true,
        name: name,

        fn (deferred) {
            fnToRun().then((result)=>{
                if(result !== 4950){
                    benchCoMws.abort('bad result:' + result);
                }
                deferred.resolve();
            });

        },

        onError(err) {
          console.error(err);
        }
    });
}

benchCoMws.add(comwsRun,'comws');
benchCoMws.add(koaRun,'koa');

benchCoMws.on('cycle', function(event) {

  console.log(String(event.target));
});

benchCoMws.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});


benchCoMws.run({ 'async': true });
