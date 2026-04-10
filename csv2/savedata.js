const fs = require('fs');
const FILE_PATH = 'logins.csv';

function saveLogin(email, password) {
    const line = `${email},${password}\n`;

    fs.appendFile(FILE_PATH, line, (err) => {
        if (err) {
            console.error("Failed to write login data:", err);
        }
    });
}

module.exports = { saveLogin };
