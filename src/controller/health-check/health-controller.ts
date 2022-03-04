import express from 'express';
import type { Request, Response } from 'express';
const router = express.Router({ mergeParams: true });


router.get('/', (req:Request, res:Response) => {
  console.log('health check');
  return res.sendStatus(200);
});

export default router;