import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { Status } from '@prisma/client';

const VALID_STATUSES: string[] = Object.values(Status);

/**
 * Create Task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate, leadId } = req.body;
    const userId = req.user?.id;

    if (!userId || !title || !priority || !leadId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        id: uuidv4(),
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        user: { connect: { id: userId } },
        lead: { connect: { id: leadId } },
      },
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task', detail: error.message });
  }
};

/**
 * Get Tasks with optional filters
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { status, sort } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (status && !VALID_STATUSES.includes(status as string)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status ? { status: status as Status } : {}),
      },
      orderBy:
        sort === 'dueDateDesc'
          ? { dueDate: 'desc' }
          : sort === 'dueDateAsc'
          ? { dueDate: 'asc' }
          : undefined,
      include: { lead: true },
    });

    res.json({
      message: 'Tasks fetched successfully',
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tasks', detail: error.message });
  }
};

/**
 * Update Task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate, leadId, status } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(status && { status }),
        ...(leadId && { lead: { connect: { id: leadId } } }),
      },
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task', detail: error.message });
  }
};

/**
 * Delete Task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId } = req.params;

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete task', detail: error.message });
  }
};
