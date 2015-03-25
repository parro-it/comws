import compose from 'composition';

function sumNatural(i){
    return function *(next){
        this.result += i;
        yield next;
    };
}


var stack = [];

for (var i=0; i<100; i++) {
    stack.push(sumNatural(i));
}


stack.push(function *(next){
    this.resolveTest(this.result);
});


// compose it into a function
var fn = compose(stack);


export default function run() {
    var ctx = {result:0};
    return new Promise((resolve, reject)=> {
        ctx.resolveTest = resolve;
        fn.call(ctx).catch(console.error);
    });

}
