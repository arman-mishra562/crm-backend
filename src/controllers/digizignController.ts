import { Request, Response } from "express";
import prisma from "../config/prisma";
import { v4 as uuidv4 } from "uuid";
import { count } from "console";


/*
 Clients
 */

// Create a client
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, leadSource, assignedBDE, status } = req.body;

    if (!name) {
      res.status(400).json({ error: "Client name is required" });
      return;
    }

    const client = await prisma.digiZignClient.create({
      data: {
        id: uuidv4(),
        name,
        email,
        phone,
        company,
        leadSource,
        assignedBDE,
        status,
      },
    });

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create client", detail: error.message });
  }
};

// Get all clients
export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await prisma.digiZignClient.findMany({
      include: { campaigns: true, activities: true },
    });
    res.json({ count: clients.length, clients });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch clients", detail: error.message });
  }
};

/*
 Campaigns
  */

// Create a campaign
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, budget, startDate, endDate, status, clientId, scope } = req.body;

    if (!name || !type || !budget || !startDate || !endDate || !status || !clientId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        id: uuidv4(),
        name,
        type,
        budget,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        clientId,
        scope,
      },
    });

    res.status(201).json({ message: "Campaign created successfully", campaign });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create campaign", detail: error.message });
  }
};

// Get all campaigns
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { client: true, feedbacks: true, activities: true },
    });
    res.json({ count: campaigns.length, campaigns });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch campaigns", detail: error.message });
  }
};
export const getActiveAndCompletedCampaigns = async (_req: Request, res: Response): Promise<void> => {
  try {
    
      const count = await prisma.campaign.count({
      where: {
        status: {
          in: ["LIVE_CAMPAIGN", "COMPLETED"] // from CampaignStatus enum
        }
     },
    });

    res.status(200).json({
      message: "Live and completed campaigns fetched successfully",
      activeCampaignCount:count
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get active campaigns count",
      detail: error.message
    });
  }
};
/*
 Feedbacks
*/

// Create feedback
export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { campaignId, rating, comments } = req.body;

    if (!campaignId || rating === undefined) {
      res.status(400).json({ error: "Campaign ID and rating are required" });
      return;
    }

    const feedback = await prisma.clientFeedback.create({
      data: {
        id: uuidv4(),
        campaignId,
        rating,
        comments,
      },
    });

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add feedback", detail: error.message });
  }
};

// Get feedbacks for a campaign
export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const feedbacks = await prisma.clientFeedback.findMany({
      where: { campaignId },
    });
    res.json({ count: feedbacks.length, feedbacks });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch feedbacks", detail: error.message });
  }
};

/*
 Metrics / Dashboard
*/

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalRunning = await prisma.campaign.count({ where: { status: "LIVE_CAMPAIGN" } });

    const engagementAgg = await prisma.campaign.aggregate({ _avg: { engagement: true } });
    const avgEngagement = engagementAgg._avg.engagement || 0;

    const totalClients = await prisma.digiZignClient.count();
    const convertedClients = await prisma.digiZignClient.count({
      where: { status: "CONTRACT_SIGNED" },
    });
    const leadConversionRate = totalClients ? (convertedClients / totalClients) * 100 : 0;

    const roiAgg = await prisma.campaign.aggregate({
      _sum: { roi: true },
      where: { status: "LIVE_CAMPAIGN" },
    });
    const totalROI = roiAgg._sum.roi || 0;

    const budgetAgg = await prisma.campaign.aggregate({
      _sum: { budget: true, spend: true },
      where: { status: "LIVE_CAMPAIGN" },
    });
    const budget = budgetAgg._sum.budget || 0;
    const spend = budgetAgg._sum.spend || 0;

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingDeadlines = await prisma.campaign.findMany({
      where: { endDate: { gte: today, lte: nextWeek } },
      select: { id: true, name: true, endDate: true, deadlines: true, status: true },
    });

    res.json({
      totalRunning,
      avgEngagement,
      leadConversionRate,
      totalROI,
      budget,
      spend,
      upcomingDeadlines,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch metrics", detail: error.message });
  }
};
