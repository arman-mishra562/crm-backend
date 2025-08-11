import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { TaskAssignmentService } from '../services/taskAssignmentService';


// Create Lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, sector } = req.body;

    // Check required fields
    if (!name || !sector) {
      res.status(400).json({ error: 'Name and sector are required' });
      return;
    }

    // Ensure at least one contact info is present
    if (!email && !phone) {
      res.status(400).json({ error: 'Either email or phone is required' });
      return;
    }

    // Build unique condition for upsert
    let whereCondition: any = {};
    if (email) {
      whereCondition.email = email;
    } else {
      whereCondition.phone = phone;
    }

    const lead = await prisma.lead.upsert({
      where: whereCondition,
      update: {
        name,
        phone,
        email,
        sector,
        updatedAt: new Date(),
      },
      create: {
        name,
        email,
        phone,
        sector,
      },
    });

    // Create task for new lead (only if it's a new lead, not an update)
    let taskResult = null;
    if (!lead.updatedAt || lead.createdAt.getTime() === lead.updatedAt.getTime()) {
      taskResult = await TaskAssignmentService.createTaskForNewLead(lead.id, lead.sector);
    }

    res.status(200).json({
      message: 'Lead upserted successfully',
      lead,
      taskCreated: taskResult?.success || false,
      task: taskResult?.task || null,
      taskError: taskResult?.error || null,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to upsert lead',
      detail: error.message,
    });
  }
};



// Get All Leads
export const getAllLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany();
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

