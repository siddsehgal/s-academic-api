import express from 'express';
import authController from '../controllers/authController.js';
const router = express.Router();

router.post('/login', authController.login);

router.post('/signup', authController.signup);

router.get('/google-login-link', authController.getGoogleLoginLink);

router.get('/google', (req, res) => {
    res.send(req.query);
});
router.get('/google-login-verify', authController.googleLoginVerify);

router.get('/facebook-login-link', authController.getFacebookLoginLink);

router.get('/facebook', (req, res) => {
    res.send(req.query);
});

router.get('/facebook-login-verify', authController.facebookLoginVerify);

export default router;
