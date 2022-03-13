import express from 'express';
import type {Request, Response} from 'express';

const router = express.Router({mergeParams: true});

// todo: - add routes
router.post('/send-message', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'message sent'
    });
});

export default router;