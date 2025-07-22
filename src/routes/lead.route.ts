import { Router } from 'express';
import { createLead, getAllLeads } from '../controllers/leadController';

const router = Router();

router.post('/', createLead);       // Create a lead
router.get('/', getAllLeads);       // Get all leads

export default router;
