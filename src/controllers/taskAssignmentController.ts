import { Request, Response } from 'express';
import { TaskAssignmentService } from '../services/taskAssignmentService';
import { SectorType } from '@prisma/client';

/**
 * Get task distribution across users in a sector
 */
export const getTaskDistribution = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sector } = req.params;

        if (!sector || !Object.values(SectorType).includes(sector as SectorType)) {
            res.status(400).json({
                error: 'Invalid sector. Must be one of: DIGIZIGN, ZURELABS, INTERNZITY, UNIZEEK'
            });
            return;
        }

        const distribution = await TaskAssignmentService.getTaskDistribution(sector as SectorType);

        res.json({
            message: 'Task distribution retrieved successfully',
            sector,
            distribution
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Failed to get task distribution',
            detail: error.message
        });
    }
};




