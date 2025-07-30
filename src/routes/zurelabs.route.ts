import express from 'express';
import {
  addZureClient,
  getActiveZureClients,
  addZureProject,
  addZureProposal,
  getZureProposalsByStatus,
  getTotalZureRevenue
} from '../controllers/zurelabsController';

const router = express.Router();

router.post('/client', addZureClient);
router.get('/clients/active', getActiveZureClients);

router.post('/project', addZureProject);

router.post('/proposal', addZureProposal);
router.get('/proposal/:status', getZureProposalsByStatus);

router.get('/revenue/total', getTotalZureRevenue);

export default router;
