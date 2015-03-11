'use strict';

import CoMws from '../src';

describe('CoMws', () => {

    it('is defined', () => {
        CoMws.should.be.a('function');
    });

    describe('is a class', () => {
        let mws;
        let ctx = {result:'yet another'};

        before( function *(){
            mws = new CoMws();
            
            mws.use(function *(next){
                this.result += yield Promise.resolve(' hello');
                yield next();
            });

            mws.use(function *(next){
                this.result += yield Promise.resolve(' world');
                yield next();
            });

            yield mws.run(ctx);
        });
        
        it('register all mws', () => {
            (mws.mws.length+'').should.be.equal('2');
        });  

        it('can construct instance', () => {
            mws.should.be.a('object');
        });        

        it('execute all mws', () => {
            ctx.result.should.be.equal('yet another hello world');
        });        
    });

    describe('handle errors', () => {
        let mws;
        let ex;

        before( function *() {
            mws = new CoMws();
            
            mws.use(function *(next){
                this.result = ('hello');
                yield next();
            });

            mws.use(function *(next){
                throw new Error('test-error');
            });

            try {
                yield mws.run({});    
            } catch(err){
                ex = err;
            }
            
        });
        
        it(' - work', () => {
            ex.message.should.be.equal('test-error');
        });  
    });

    describe('allow function mw returning next', () => {
        let mws;
        let ctx = {};

        before( function *() {
            mws = new CoMws();
            
            mws.use(function(next) {
                this.result = 'hello';
                return next();
            });

            mws.use(function *(next){
                 this.result += ' world';
            });

            yield mws.run(ctx);    
            
        });
        
        it(' - work', () => {
            ctx.result.should.be.equal('hello world');
        });  
    });

     describe('allow function mw returning a promise', () => {
        let mws;
        let ctx = {};

        before( function *() {
            mws = new CoMws();
            
            mws.use(function(next) {
                return new Promise((resolve) => {
                    next().then(()=>{
                        this.result += ' world';    
                        resolve();
                    });
                    
                });
                
            });

            mws.use(function *(next){
                 this.result = 'hello';
            });

            yield mws.run(ctx);    
            
        });
        
        it(' - work', () => {
            ctx.result.should.be.equal('hello world');
        });  
    });


     describe('allow function mw returning a normal value', () => {
        let mws;
        let ctx = {};

        before( function *() {
            mws = new CoMws();
            
            mws.use(function * (next){
                this.result = yield Promise.resolve('hello');
                yield next();
            });

            mws.use(function (next){
                this.result += ' world';
                return null;
            });


            yield mws.run(ctx);    
            
        });
        
        it(' - work', () => {
            ctx.result.should.be.equal('hello world');
        });  
    });

    describe('allow generators, arrow and normal function with ctx arg', () => {
        let mws;
        let ctx = {};

        before( function *() {
            mws = new CoMws();
            
            mws.use((ctx, next) => {
                ctx.result = 'hello';
                return next();
            });

            mws.use(function (ctx, next){
                ctx.result += ' magic';
                return next();
            });

            mws.use(function (ctx, next){
                ctx.result += ' world';
            });


            yield mws.run(ctx);    
            
        });
        
        it(' - work', () => {
            ctx.result.should.be.equal('hello magic world');
        });  
    });


});
