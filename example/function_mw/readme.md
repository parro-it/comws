# hello world example

This example show you how to define a function middleware (one that don't use generators).

Please note that if you return a promise, execution of downstream middlewares
continue only when the promise is resolved.

If you don't need this async pattern, simply return a value. Comws will take care of
wrap it with a Promise.resolve, so downstream middlewares are not to be aware you're
returning a non promise.

##run this example

cwd here, then, to run with iojs

```sh
		npm install
		node .
```

If you are using node 0.11 or 0.12, remember to add `harmony` flag

```sh
		npm install
		node --harmony .
```

If it work, you should see on console

```
 start at 1426099977350
 first at 1426099977352
 second running at 1426099977353
 after second at 1426099978357

```
