/**
 * steamer-plugin-mock 样例mock文件
 */
const faker = require('faker');
function generateUsers () {
    let users = [];
    // For more usage of faker.js, please visit http://marak.github.io/faker.js/
    for(let id = 0; id < 50; id++) {
        users.push({
            id: id,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.phoneNumber(),
            avatar: faker.internet.avatar()
        })
    }
    return users;
}
const users = generateUsers();
const data = {
    users: users
}

module.exports = ()=>{return data};