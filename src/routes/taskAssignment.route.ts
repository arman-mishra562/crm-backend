import { Router } from 'express';
import {
    getTaskDistribution
} from '../controllers/taskAssignmentController';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(isAuthenticated);

// Get task distribution across users in a sector
router.get('/distribution/:sector', getTaskDistribution);





export default router;
