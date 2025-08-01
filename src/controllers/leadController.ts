import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';

// Create Lead
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, sector } = req.body;

    if (!name || !email || !phone || !sector) {
      res.status(400).json({ error: 'Name, email, phone, and sector are required' });
      return;
    }

    const lead = await prisma.lead.upsert({
      where: { email },
      update: {
        name,
        phone,
        sector,
        updatedAt: new Date(),
      },
      create: {
        id: uuidv4(),
        name,
        email,
        phone,
        sector,
      },
    });

    res.status(200).json({
      message: 'Lead upserted successfully',
      lead,
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

