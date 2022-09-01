import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {
    LoginSchema,
    SignupSchema,
    passwordSchema,
} from '../validators/authValidator.js';
import catchAsync from '../utils/catchAsync.js';

class authController {
    //Singup Post API
    static signup = catchAsync(async (req, res, next) => {
        const { name, email } = req.body;

        const isValid = SignupSchema.validate(req.body);

        if (isValid.error) {
            return res.status(200).send({
                message: isValid.error.details[0].message,
                status: 'fail',
            });
        }

        const isPassValid = passwordSchema.validate(req.body.password, {
            details: true,
        });

        if (isPassValid && isPassValid.length > 0)
            return res.status(200).send({
                message: isPassValid[0].message,
                status: 'fail',
            });

        const hash = bcrypt.hashSync(req.body.password, 10);

        let user = await global.DB.User.findOne({
            email: email.toLowerCase(),
        });

        if (user)
            return res
                .status(400)
                .send({ message: 'User already exist with this email!!' });

        const newUser = new global.DB.User({
            name,
            email,
            password: hash,
        });

        user = await newUser.save();
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.send({
            message: 'User Sign Up Successfully!!',
            token,
            user,
        });
    });

    // Login Post API
    static login = catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        const isValid = LoginSchema.validate(req.body);
        if (isValid.error) {
            return res.status(200).send({
                message: isValid.error.details[0].message,
                status: 'fail',
            });
        }

        const user = await global.DB.User.findOne({ email: email });

        if (!user)
            return res.status(400).send({
                error: 'No User Exist with given Email Address!!',
            });

        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).send({ error: 'Incorrect Password!!' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.send({
            message: 'Login Successfully!!',
            token,
            user,
        });
    });

    // Get Google SignIn Link
    static getGoogleLoginLink = catchAsync(async (req, res) => {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: `${process.env.ROOT_URL}${process.env.GOOGLE_REDIRECT_URI}`,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };
        const googleAuthURL = `${rootUrl}?${new URLSearchParams(
            options
        ).toString()}`;

        return res.send(googleAuthURL);
    });

    // Verify Google SignIn
    static googleLoginVerify = catchAsync(async (req, res) => {
        const code = req.query.code;

        const queryOption = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.ROOT_URL}${process.env.GOOGLE_REDIRECT_URI}`,
            grant_type: 'authorization_code',
        };

        let tokenReqOptions = {
            url: `https://oauth2.googleapis.com/token?${new URLSearchParams(
                queryOption
            ).toString()}`,
            method: 'POST',
        };

        let tokens = await axios.request(tokenReqOptions).catch((error) => {
            return { isError: true, error: error.response.data };
        });

        if (tokens.isError)
            return res.status(400).send({
                message: `Failed to fetch auth tokens`,
                error: tokens.error,
            });

        const { id_token, access_token } = tokens.data;

        let userReqOptions = {
            url: `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&${new URLSearchParams(
                {
                    access_token,
                }
            ).toString()}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        };

        let googleUser = await axios.request(userReqOptions).catch((error) => {
            return { isError: true, error: error.response.data };
        });

        if (googleUser.isError)
            return res.status(400).send({
                message: `Failed to fetch user`,
                error: googleUser.error,
            });

        const { email, name } = googleUser.data;

        let user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            const newUser = new userModel({
                userName: name,
                email: email,
            });

            user = await newUser.save();
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.status(200).send({ message: 'Login Successfully', token, user });
    });
}

export default authController;
