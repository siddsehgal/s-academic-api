import express from 'express';
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', classController.getAll);
router.get('/:id', classController.getOne);
router.post('/', classController.create);
router.patch('/:id', classController.update);
router.delete('/:id', classController.delete);

export default router;
