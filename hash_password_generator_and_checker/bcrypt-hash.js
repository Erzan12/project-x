const bcrypt = require('bcrypt');

async function run() {
    const password = 'hr1234';
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
}

run();
