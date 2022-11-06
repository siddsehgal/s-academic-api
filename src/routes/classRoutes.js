import express from 'express';
import classController from '../controllers/classController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.get('/', classController.getAll);

router.use(authController.verifyToken);

router.get('/:id', classController.getOne);
router.post('/', classController.create);
router.patch('/:id', classController.update);
router.delete('/:id', classController.delete);
router.get('/list', classController.getClassList);

export default router;
