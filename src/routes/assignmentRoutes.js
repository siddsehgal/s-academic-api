import express from 'express';
import assignmentController from '../controllers/assignmentController.js';
import authController from '../controllers/authController.js';
const router = express.Router();

router.use(authController.verifyToken);

router.get('/', assignmentController.getAll);
router.get('/:id', assignmentController.getOne);
router.post('/', assignmentController.create);
router.patch('/:id', assignmentController.update);
router.delete('/:id', assignmentController.delete);

router.get('/attempt/all', assignmentController.getAttemptAssignment);
router.post('/attempt', assignmentController.attempt);
router.get('/dashboard/list', assignmentController.getDashboardAssignmentList)

export default router;
