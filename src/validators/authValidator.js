import Joi from 'joi';
import passwordValidator from 'password-validator';

export const LoginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required().lowercase(),
});

export const SignupSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required(),
    repeat_password: Joi.ref('password'),
});

export const passwordSchema = new passwordValidator()
    .is()
    .min(8, 'Password length must be at least 8 characters') // Minimum length 8
    .is()
    .max(100, 'Password can be of Max 8 characters') // Maximum length 100
    .has()
    .uppercase(1, 'Password must contain an uppercase Character') // Must have uppercase letters
    .has()
    .lowercase(1, 'Password must contain a lowercase Character') // Must have lowercase letters
    .has()
    .digits(2, 'Password must contain a Number') // Must have at least 2 digits
    .has()
    .symbols(1, 'Password must contain a Symbol')
    .has()
    .not()
    .spaces(1, 'Password can not contain a Space');
