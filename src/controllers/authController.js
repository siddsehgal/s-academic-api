import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {
    LoginSchema,
    SignupSchema,
    passwordSchema,
} from '../validators/authValidator.js';
import catchAsync from '../utils/catchAsync.js';
import moment from 'moment';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class authController {
    //Singup Post API
    static signup = catchAsync(async (req, res, next) => {
        const { name, email, password, repeatPassword, userClass } = req.body;

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
            return res.status(200).send({
                status: 'fail',
                message: 'User already exist with this email!!',
            });
        const classData = await global.DB.Class.findOne({ _id: userClass });
        if (!classData)
            return res.status(200).send({
                status: 'fail',
                message: 'No Class found!!',
            });

        const newUser = new global.DB.User({
            name,
            email,
            password: hash,
            class_id: classData._id,
            userClass: classData.title,
            isGoogleLogin: false,
            joinDate: moment(new Date()).format('DD/MM/YYYY'),
        });

        user = await newUser.save();
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.send({
            status: 'success',
            message: 'User Sign Up Successfully!!',
            data: { token, user },
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
            return res.status(200).send({
                status: 'fail',
                message: 'No User Exist with given Email Address!!',
            });
        else if (user.isGoogleLogin)
            return res.status(200).send({
                status: 'fail',
                message:
                    'Your Account is Linked with Google.\nPlease use Login with Google Instead!!',
            });

        if (!bcrypt.compareSync(password, user.password))
            return res
                .status(200)
                .send({ status: 'fail', message: 'Incorrect Password!!' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.send({
            status: 'success',
            message: 'Login Successfully!!',
            data: { token, user },
        });
    });
    static async verify(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        return payload;
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }

    static googleLogin = catchAsync(async (req, res, next) => {
        const response = await this.verify(req.body.token);
        const { email, name, sub: googleId, picture: googleImgUrl } = response;

        let user = await global.DB.User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            const newUser = await new global.DB.User({
                name,
                email,
                googleId,
                googleImgUrl,
                isGoogleLogin: true,
                joinDate: moment(new Date()).format('DD/MM/YYYY'),
            });
            user = await newUser.save();
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY || 'TheSecretKey',
            { expiresIn: process.env.JWT_EXP_TIME || '24h' }
        );

        res.send({
            status: 'success',
            message: 'User Login Successfully!!',
            data: { token, user },
        });
    });

    // Verify Token
    static verifyToken = catchAsync(async (req, res, next) => {
        let token = null;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(200).send({
                message: 'Token not found',
                status: 'fail',
            });
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY || 'TheSecretKey'
            );
            const { id } = decoded;

            const user = await global.DB.User.findOne({
                _id: id,
            });

            if (!user)
                return res.status(200).send({
                    message: 'No User found with this Token!!',
                    status: 'fail',
                });

            req.user = user;
            next();
        } catch (error) {
            return res.status(200).send({
                message: 'Token Invalid or Expired',
                status: 'fail',
            });
        }
    });

    // Check Login
    static checkLogin = catchAsync(async (req, res, next) => {
        res.send({
            status: 'success',
            message: 'Logged In',
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
