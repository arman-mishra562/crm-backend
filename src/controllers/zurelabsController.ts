import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ProposalStatus } from '@prisma/client';

// ✅ Add client
export const addZureClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await prisma.zureClient.create({
      data: req.body,
    });
    res.status(201).json({ message: 'Client added', client });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add client', detail: err });
  }
};

// ✅ Get all active clients
export const getActiveZureClients = async (_req: Request, res: Response): Promise<void> => {
  try {
    const clients = await prisma.zureClient.findMany({
      where: { isActive: true },
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clients', detail: err });
  }
};

// ✅ Add project
export const addZureProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.zureProject.create({
      data: req.body,
    });
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project', detail: err });
  }
};

// ✅ Add proposal
export const addZureProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const proposal = await prisma.zureProposal.create({
      data: req.body,
    });
    res.status(201).json({ message: 'Proposal added', proposal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add proposal', detail: err });
  }
};

// ✅ Get proposals by status (e.g., SENT, PENDING, etc.)

export const getZureProposalsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const statusParam = req.params.status?.toUpperCase();

    // Validate status using the ProposalStatus Enum from Prisma
    if (!statusParam || !Object.values(ProposalStatus).includes(statusParam as ProposalStatus)) {
      res.status(400).json({ error: 'Invalid proposal status' });
      return;
    }

    const proposals = await prisma.zureProposal.findMany({
      where: { proposalstatus: statusParam as ProposalStatus },  // Use enum type here
      include: { client: true },
    });

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch proposals', detail: err });
  }
};

// ✅ Calculate total revenue from proposals where status is PAID
export const getTotalZureRevenue = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await prisma.zureProposal.aggregate({
      where: { proposalstatus: 'PAID' },
      _sum: { amount: true },
    });

    res.json({
      message: 'Total revenue fetched',
      revenue: result._sum.amount || 0,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch revenue',
      detail: err,
    });
  }
};
