const mongoose = require('mongoose');
const { userStatusEnum, userRoleEnum } = require('./users.enum')

const UserSchema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    firstName: {
        type: 'string',
        required: true,
        trim: true,
        index: true
    },
    lastName: {
        type: 'string',
        required: true,
        trim: true,
    },
    password: {
        type: 'string',
        required: true,
        trim: true,
    },
    passwordResetCode: {
        type: 'string',
        trim: true,
    },
    role: {
        type: 'string',
        enum: Object.values(userRoleEnum),
        default: userRoleEnum.USER
    },
    status: {
        type: 'string',
        enum: Object.values(userStatusEnum),
        default: userStatusEnum.PENDING
    }

}, { versionKey: false, timestamps: true, virtuals: true });

module.exports = mongoose.model('User', UserSchema)