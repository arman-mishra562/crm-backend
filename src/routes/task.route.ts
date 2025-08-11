import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, giveTaskFeedback} from '../controllers/taskController';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Create a Task
router.post('/',isAuthenticated, createTask);

// Get Tasks with optional filters (userId is required as query param)
router.get('/',isAuthenticated, getTasks);

// Update a Task (excluding status)
router.put('/:taskId', updateTask);

// Delete a Task
router.delete('/:taskId', deleteTask);

// Admin feedback route
router.post('/:taskId/feedback', isAuthenticated, giveTaskFeedback);

export default router;
