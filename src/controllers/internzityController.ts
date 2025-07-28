import { Request, Response } from 'express';
import axios from 'axios';

/**
 * GET route for dashboard:
 * Fetches live metrics from Internzity backend and returns it directly.
 */
export const fetchLiveInternzityMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${process.env.INTERNZITY_BACKEND_URL}/api/crm/customers`);
    res.json({
      message: 'Live Internzity metrics fetched successfully',
      data: response.data,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to fetch Internzity metrics',
      detail: err.response?.data || err.message,
    });
  }
};
