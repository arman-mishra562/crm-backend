import { Request, Response, NextFunction, RequestHandler } from 'express';
import { SectorType } from '@prisma/client'; // Prisma-generated enum

export const sectorAccess = (allowedSectors: SectorType[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user?.sector || !allowedSectors.includes(req.user.sector as SectorType)) {
      res.status(403).json({ message: 'Access denied for your sector' });
      return;
    }
    next();
  };
};

