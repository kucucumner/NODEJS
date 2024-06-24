let members = ['ku', 'kyo', 'hyun'];
console.log(members[1]); // kyo

// 객체
let roles = {
    'programmer' : 'ku',
    'dog' : 'toto',
    'staba' : 'cafe'
}
console.log(roles.dog); // toto

for(let name in roles){
    console.log('object =>', name,
        'value =>', roles[name]
    );
}