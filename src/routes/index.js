import express from 'express';
import authRoutes from './authRoutes.js';
import classRoutes from './classRoutes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/class', classRoutes);

export default router;
