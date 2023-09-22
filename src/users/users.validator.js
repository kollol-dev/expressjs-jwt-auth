const Joi = require("joi");

module.exports = {
    signUpValidator: Joi.object()
        .options({ abortEarly: false, stripUnknown: true })
        .keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.any().equal(Joi.ref('password'))
                .required()
                .label('Confirm password')
                .messages({ 'any.only': '{{#label}} does not match' })
        }),

    loginValidator: Joi.object()
        .options({ abortEarly: false, stripUnknown: true })
        .keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(6).required(),
        }),
}

