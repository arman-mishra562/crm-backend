import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/prisma';
import { Priority, Status, SectorType } from '@prisma/client';

export interface TaskAssignmentResult {
    success: boolean;
    task?: any;
    error?: string;
}

/**
 * Service to automatically create and assign a task when a new lead is added
 */
export class TaskAssignmentService {
    /**
     * Creates a task for a new lead and assigns it to the most suitable user
     */
    static async createTaskForNewLead(leadId: string, sector: SectorType): Promise<TaskAssignmentResult> {
        try {
            // Find users from the same sector
            const usersInSector = await prisma.user.findMany({
                where: { sector },
                include: {
                    tasks: {
                        where: { status: 'PENDING' },
                        select: { id: true }
                    }
                }
            });

            if (usersInSector.length === 0) {
                return {
                    success: false,
                    error: `No users found in sector ${sector}`
                };
            }

            // Find the user with the least pending tasks
            const userWithLeastTasks = usersInSector.reduce((prev, current) => {
                return prev.tasks.length <= current.tasks.length ? prev : current;
            });

            // Calculate due date (24 hours from now)
            const dueDate = new Date();
            dueDate.setHours(dueDate.getHours() + 24);

            // Create the task
            const task = await prisma.task.create({
                data: {
                    id: uuidv4(),
                    title: 'NEW LEAD ADDED',
                    description: 'Contact the Lead',
                    priority: 'HIGH',
                    dueDate: dueDate,
                    status: 'PENDING',
                    userId: userWithLeastTasks.id,
                    leadId: leadId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            sector: true
                        }
                    },
                    lead: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            sector: true
                        }
                    }
                }
            });

            return {
                success: true,
                task
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get task distribution across users in a sector
     */
    static async getTaskDistribution(sector: SectorType) {
        try {
            const users = await prisma.user.findMany({
                where: { sector },
                include: {
                    tasks: {
                        where: { status: 'PENDING' },
                        select: { id: true }
                    }
                }
            });

            return users.map(user => ({
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                pendingTasksCount: user.tasks.length
            }));
        } catch (error: any) {
            throw new Error(`Failed to get task distribution: ${error.message}`);
        }
    }


}
