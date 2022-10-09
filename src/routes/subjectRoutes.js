import express from 'express';
import subjectController from '../controllers/subjectController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getOne);
router.post('/', subjectController.create);
router.patch('/:id', subjectController.update);
router.delete('/:id', subjectController.delete);

export default router;
