const bcrypt = require('bcrypt');

async function run() {
    const password = 'itPassword';
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
}

run();
