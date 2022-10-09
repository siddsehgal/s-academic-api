import express from 'express';
import authController from '../controllers/authController.js';
const router = express.Router();

router.post('/login', authController.login);

router.post('/signup', authController.signup);

router.post('/google-login', authController.googleLogin);

router.get('/google-login-link', authController.getGoogleLoginLink);

router.get('/google', (req, res) => {
    res.send(req.query);
});
router.get('/google-login-verify', authController.googleLoginVerify);

router.use(authController.verifyToken);
router.get('/verify-login', authController.checkLogin);

export default router;
