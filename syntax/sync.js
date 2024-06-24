const fs = require('fs'); // fs 모듈을 불러와서 fs 라는 이름의 변수를 만듬

// readFileSync
console.log('A');
const result = fs.readFileSync('syntax/sample.txt', 'utf-8');
console.log(result); // 변수 result의 값을 출력
console.log('C');


console.log('A');
// 콜백 함수를 사용 function(err, ~~)
fs.readFile('syntax/sample.txt', 'utf-8', function(err, result){
    console.log(result); 
});

console.log('C');