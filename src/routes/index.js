import express from 'express';
import authRoutes from './authRoutes.js';
import classRoutes from './classRoutes.js';
import noteRoutes from './noteRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import topicRoutes from './topicRoutes.js';
import videoRoutes from './videoRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';
import userRoutes from './userRoutes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/class', classRoutes);
router.use('/subject', subjectRoutes);
router.use('/topic', topicRoutes);
router.use('/note', noteRoutes);
router.use('/video', videoRoutes);
router.use('/assignment', assignmentRoutes);
router.use('/user', userRoutes);

export default router;
