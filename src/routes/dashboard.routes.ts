import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { sectorAccess } from '../middlewares/sectorAccess.middleware';
import { SectorType } from '@prisma/client';

const router = express.Router();

router.get('/digizign', isAuthenticated, sectorAccess([SectorType.DIGIZIGN]), (req, res) => {
    res.json({ message: 'Welcome to DigiZign' });
});

router.get('/zurelabs', isAuthenticated, sectorAccess([SectorType.ZURELABS]), (req, res) => {
    res.json({ message: 'Welcome to ZureLab' });
});

router.get('/internzity', isAuthenticated, sectorAccess([SectorType.INTERNZITY]), (req, res) => {
    res.json({ message: 'Welcome to Internzity' });
});

router.get('/unizeek', isAuthenticated, sectorAccess([SectorType.UNIZEEK]), (req, res) => {
    res.json({ message: 'Welcome to Unizeek' });
});

export default router;
