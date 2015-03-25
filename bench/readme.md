# benchmark

This benchmark try to compare performance of comws
middlewares (the one you'll find on master branch), koa middlewares, composition middlewares
(composition is the middleware engine that power koa)
and an alternate comws implementation base (the one you'll find on this branch).

The test middleware chain is composed by 100
middleware, that together sum first 100 natural.

I ran tests on iojs

## How to run tests.

Clone the repo,
then `git checkout benchmark` to go to this branch,
then `npm install` to install main deps,
then cd to bench folder `npm install` to install benchmark deps,
finally `node .` to run tests

## test result

```
comws x 145 ops/sec ±3.40% (80 runs sampled)
comws+bluebird x 13.47 ops/sec ±1.96% (68 runs sampled)
koa x 182 ops/sec ±2.22% (81 runs sampled)
composition x 162 ops/sec ±1.25% (86 runs sampled)
Fastest is koa
```

It appear that co is outperforming bluebird by a large margin.
Strangely, koa is fast than composition, this is not expected
because it is using composition itself to run middleware chain.

comws is slower than koa or composition by a little margin.
Time to optimize it!

If you are reading this, I need peer code review
of the benchmark suite to make sure I'm not doing something wrong
with koa or composition. Thank you!
