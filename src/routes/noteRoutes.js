import express from 'express';
import noteController from '../controllers/noteController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', noteController.getAll);
router.get('/:id', noteController.getOne);
router.post('/', noteController.create);
router.patch('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;
