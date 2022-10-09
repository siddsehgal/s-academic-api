import express from 'express';
import videoController from '../controllers/videoController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', videoController.getAll);
router.get('/:id', videoController.getOne);
router.post('/', videoController.create);
router.patch('/:id', videoController.update);
router.delete('/:id', videoController.delete);

export default router;
