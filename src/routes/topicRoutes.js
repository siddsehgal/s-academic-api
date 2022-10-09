import express from 'express';
import topicController from '../controllers/topicController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', topicController.getAll);
router.get('/:id', topicController.getOne);
router.post('/', topicController.create);
router.patch('/:id', topicController.update);
router.delete('/:id', topicController.delete);

export default router;
