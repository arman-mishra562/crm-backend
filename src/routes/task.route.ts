import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';

const router = Router();

// Create a Task
router.post('/', createTask);

// Get Tasks with optional filters (userId is required as query param)
router.get('/', getTasks);

// Update a Task (excluding status)
router.put('/:taskId', updateTask);

// Delete a Task
router.delete('/:taskId', deleteTask);

export default router;
