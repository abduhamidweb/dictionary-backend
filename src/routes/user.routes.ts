import express from 'express';
import userController from '../controllers/user.contr.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', userController.createUser.bind(userController));
router.get('/', authMiddleware, userController.getAllUsers.bind(userController));
router.get('/:id', authMiddleware, userController.getUserById.bind(userController));
router.put('/:id', authMiddleware, userController.updateUser.bind(userController));
router.delete('/:id', authMiddleware, userController.deleteUser.bind(userController));

export default router;
