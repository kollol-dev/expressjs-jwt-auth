const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')
const UserModel = require("./users.model");
const { jwt: { secret: jwtSecret, expiresIn: jwtExpiresIn } } = require("../config/environments")

module.exports = {
    getUser: ({ _id, email }) =>{
        return User_model.findOne({ _id, email }).exec();
    },

    getUserByEmail({ email }) {
        return UserModel.findOne({ email }).exec();
    },

    createUser: (user) => {
        return UserModel.create(user)
    },

    createSecret: ({ email, id, role, status }) => {
        return JWT.sign({ email, id, role, status },
            jwtSecret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: jwtExpiresIn,
            })
    },

    createRefreshToken: ({ email, id, role, status }) => {
        return JWT.sign({ email, id, role, status },
            jwtSecret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: '15d',
            })
    },

    verifyToken: ({ token }) => {
        return JWT.verify(token, jwtSecret)
    },

    comparePassword: (User, password) => {
        return bcrypt.compareSync(
            password,
            User.password
        );
    }
};
