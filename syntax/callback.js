// function a(){
//     console.log('A');
// }
// a();

// 자바스크립트에서는 함수가 값이다.
const a = function(){
    console.log('A');
}

// 함수 실행이 끝났을 때 그 다음일을 시킬 때 callback을 사용
function slowfunc(callback){
    callback();
}
// callback 이라는 parameter는 a가 가리키는 함수를 갖게 된다. 따라서 A가 출력
slowfunc(a);