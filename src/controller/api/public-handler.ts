import express from 'express';
import type {Request, Response} from 'express';
import {MessengerResponder} from "../webhook/webhook-handler";

const router = express.Router({mergeParams: true});

type SendMessageRequest = Request<{}, {}, { message: string; to: string | string[]; }>;

router.post('/send-message', async (req: SendMessageRequest, res: Response) => {
    try {
        const {message, to} = req.body;
        console.log(`send-message ${message} to ${to}`);

        if (typeof to === 'string') {
            const responder = new MessengerResponder(to)
            await responder.sendTextMessage(message);
        }

        return res.sendStatus(200);

    } catch (err) {
        console.log(err.message)
        res.status(500)
    }
 });

export default router;