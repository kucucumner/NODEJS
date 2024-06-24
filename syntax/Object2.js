const f = function (){
    console.log(1+1);
    console.log(1+2);
}
console.log(f);
const a = [f];
a[0]();
// const i = if(true){console.log(1)};
// const w = while(true){console.log(1)};

const o = {
    func:f
}
o.func();