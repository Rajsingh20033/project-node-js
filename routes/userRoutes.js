import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';

router.post('/register', UserController.registerUser);
router.post('/verify', UserController.verifyUser);

export default router;
