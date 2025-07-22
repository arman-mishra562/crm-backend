import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';

// Create Task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate, userId, leadId } = req.body;

    const task = await prisma.task.create({
  data: {
    id: uuidv4(),
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    user: {
      connect: { id: userId },
    },
    lead: {
      connect: { id: leadId },
    },
  },
});
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Tasks with Filter & Sort
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, status, sort } = req.query;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: userId as string,
        ...(status && status !== 'All' ? { status: status as string } : {}),
      },
      orderBy: sort === 'dueDateDesc' ? { dueDate: 'desc' }
              : sort === 'dueDateAsc' ? { dueDate: 'asc' }
              : undefined,
      include: { lead: true },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// Update Task 
export const updateTask = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate, leadId } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(leadId && { lead: { connect: { id: leadId } } }),
      }
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { taskId } = req.params;

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
