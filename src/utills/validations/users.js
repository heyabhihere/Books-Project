const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    DOB: Joi.date().required(),
    email: Joi.string().email().required(),
    gender: Joi.number().required(),
    jti: Joi.string().optional(),
    password: Joi.string().required()
});

const userRegister = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const changePasswordValidation = Joi.object({
    password: Joi.string().required(),
    newPassword: Joi.string().required()
})

const updateProfileValidation = Joi.object({
    name: Joi.string().optional(),
    gender: Joi.number().optional(),
    DOB: Joi.date().optional()
});

module.exports = { userSchema, loginValidation, changePasswordValidation, userRegister, updateProfileValidation };