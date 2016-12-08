# hello world example

this example explain you error management with co-mws

##How to run this example

cwd here, then to run with iojs:

```sh
		npm install
		node .
```

If you are using node 0.11 or 0.12, remember to add `harmony` flag:

```sh
		npm install
		node --harmony .
```

If it work, you should see on console a pretty formatted error message:

```
Error: Yike!

	- index.js:5
		co-mws/example/error-management/i
		ndex.js:5:11

	- GeneratorFunctionPrototype.next

	- index.js:61 onFulfilled
		[co-mws]/[co]/index.js:61:19

	- index.js:50
		[co-mws]/[co]/index.js:50:5

	- index.js:49 co
		[co-mws]/[co]/index.js:49:10

	- index.js:30 createPromise
		[co-mws]/[co]/index.js:30:15

	- index.js:89 step
		co-mws/dist/index.js:89:45

	- index.js:104 CoMws.run
		co-mws/dist/index.js:104:24

	- index.js:11 Object.<anonymous>
		co-mws/example/error-management/i
		ndex.js:11:5

	- module.js:444 Module._compile
		module.js:444:26

```




##Custom error handler

It's also possible to install a custom error handler.
Error handlers are middleware with a signature of function(ctx, err, next).
When a middleware throws, comws search for middlewares with this signature
that follows in chain the one that throws. If no one is found, a default one
get called (and print what you see in previous example)

Run this example:

cwd here, then to run with iojs:

```sh
		npm install
		node error-handler
```

If you are using node 0.11 or 0.12, remember to add `harmony` flag:

```sh
		npm install
		node --harmony error-handler
```

If it work, you should see on console:

```
Yike!
```
