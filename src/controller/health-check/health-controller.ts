import express from 'express';
import type { Request, Response } from 'express';
import { Logger } from '../../utils/logger';
const router = express.Router({ mergeParams: true });

router.get('/', (req: Request, res: Response) => {
  Logger.info('health check');
  return res.status(200).json({ stage: process.env.stage });
});

export default router;
