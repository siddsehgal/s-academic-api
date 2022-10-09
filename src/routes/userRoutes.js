import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', userController.getOne);
router.patch('/', userController.update);

export default router;
