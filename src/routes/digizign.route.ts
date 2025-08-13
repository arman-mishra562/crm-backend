import { Router } from "express";
import {
  createClient,
  getClients,
  createCampaign,
  getCampaigns,
  getActiveAndCompletedCampaigns,
  createFeedback,
  getFeedbacks,
  getMetrics
} from "../controllers/digizignController";
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(isAuthenticated)

// Clients
router.post("/clients", createClient);
router.get("/clients", getClients);

// Campaigns
router.post("/campaigns", createCampaign);
router.get("/campaigns", getCampaigns);
router.get("/campaigns/active",getActiveAndCompletedCampaigns)



 // Feedbacks
router.post("/feedbacks", createFeedback);
router.get("/feedbacks/:campaignId", getFeedbacks);


// Dashboard / Metrics 
router.get("/metrics", getMetrics);

export default router;
