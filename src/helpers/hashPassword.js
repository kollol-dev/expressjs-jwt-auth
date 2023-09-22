const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = (password) => {
    return bcrypt.hash(password, saltRounds)
}