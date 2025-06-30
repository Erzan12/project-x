const bcrypt = require('bcrypt');

const password = 'itPassword';
const storedHash = '$2b$10$zxh6XNqoXtSTG.VADM0eUuN.if3YiMnBNoeLVrQKg/u/25/i7m3hC';

bcrypt.compare(password, storedHash).then(result => {
    console.log('Valid?', result); // Should be true if it matches
});
