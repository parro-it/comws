import comwsRun from './with_comws';
import comwsBBRun from './with_comws_bb';
import koaRun from './with_koa';
import composition from './with_composition';

import Benchmark from 'benchmark';
var benchCoMws = new Benchmark.Suite();

function makeBench(fnToRun,name){
    return new Benchmark({
        defer: true,
        name: name,

        fn (deferred) {
            fnToRun().then((result)=>{
                if(result !== 4950){
                    console.error('bad result:' + result);
                    benchCoMws.abort();
                }
                deferred.resolve();
            }).catch(console.log);

        },

        onError(err) {
          console.error(err);
        }
    });
}

benchCoMws.add(makeBench(comwsRun,'comws'));
benchCoMws.add(makeBench(comwsBBRun,'comws+bluebird'));
benchCoMws.add(makeBench(koaRun,'koa'));
benchCoMws.add(makeBench(composition,'composition'));

benchCoMws.on('cycle', function(event) {

  console.log(String(event.target));
});

benchCoMws.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});


benchCoMws.run({ 'async': true });
