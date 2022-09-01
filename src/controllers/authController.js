import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcrypt';

class authController {
    //Singup Post API
    static signup = async (req, res, next) => {
        try {
            const { userName, email } = req.body;
            const hash = bcrypt.hashSync(req.body.password, 10);

            let user = await userModel.findOne({
                email: email.toLowerCase(),
            });

            if (user)
                return res
                    .status(400)
                    .send({ message: 'User already exist with this email!!' });

            const newUser = new userModel({
                userName: userName,
                email: email,
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
        } catch (error) {
            console.log(error);
        }
    };

    // Login Post API
    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email: email });

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
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Get Google SignIn Link
    static getGoogleLoginLink = async (req, res) => {
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
    };

    // Verify Google SignIn
    static googleLoginVerify = async (req, res) => {
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
    };

    // Get Facebook SignIn Link
    static getFacebookLoginLink = async (req, res) => {
        const rootUrl = 'https://www.facebook.com/v14.0/dialog/oauth';
        const options = {
            redirect_uri: `${process.env.ROOT_URL}${process.env.FACEBOOK_REDIRECT_URI}`,
            client_id: process.env.FACEBOOK_CLIENT_ID,
        };
        const facebookAuthURL = `${rootUrl}?${new URLSearchParams(
            options
        ).toString()}`;

        return res.send({ options, facebookAuthURL });
    };

    // Verify Facebook SignIn
    static facebookLoginVerify = async (req, res) => {
        const code = req.query.code;

        let queryOption = {
            client_id: process.env.FACEBOOK_CLIENT_ID,
            redirect_uri: `${process.env.ROOT_URL}${process.env.FACEBOOK_REDIRECT_URI}`,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            code,
        };
        let tokenReqOptions = {
            url: `https://graph.facebook.com/v14.0/oauth/access_token?${new URLSearchParams(
                queryOption
            ).toString()}`,
            method: 'GET',
        };

        let tokenRes = await axios.request(tokenReqOptions).catch((error) => {
            return { isError: true, error: error.response.data };
        });

        if (tokenRes.isError)
            return res.status(400).send({ data: tokenRes.error });

        const { access_token } = tokenRes.data;

        let userDataQueryOptions = {
            fields: 'email,name',
            access_token,
        };

        let userDataReqOptions = {
            url: `https://graph.facebook.com/me?${new URLSearchParams(
                userDataQueryOptions
            ).toString()}`,
            method: 'GET',
        };

        let userData = await axios
            .request(userDataReqOptions)
            .catch((error) => {
                return { isError: true, error: error.response.data };
            });

        if (userData.isError)
            return res.status(400).send({ data: userData.error });

        const { email, name, id } = userData.data;

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
    };
}

export default authController;
