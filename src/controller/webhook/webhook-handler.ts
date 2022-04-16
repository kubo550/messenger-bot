import express, { Request, Response} from 'express';
import {ReceivedMessage} from "../../domain/types";
import {ResponseFactory} from "../../services/response-factory";
import {Sender} from "../../services/sender";
import {getPayload, isValidMode, isValidToken, verifyModeAndToken} from "./verificationUtils";


const router = express.Router({mergeParams: true});

// webhook verification endpoint
router.get('/', verifyModeAndToken, (req: Request, res: Response) => {
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"];

    if (isValidMode(mode) && isValidToken(token)) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
    } else {
        return res.status(403).json({error: "Verification failed"});
    }
});

// receive messages from facebook messenger
router.post('/', async (req: Request<{}, {}, ReceivedMessage>, res: Response) => {
    console.log("RECEIVED_MESSAGE", JSON.stringify(req.body));

    if (req.body.object === "page") {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                const message = event.message.text;
                const sender = event.sender.id;

                const payload = getPayload(event)
                const responder = new ResponseFactory().getResponder(payload);

                try {
                    const response = await responder.handlePayload();
                    await Sender.sendMessage(sender, response);
                } catch (err) {
                    console.error(err.message);
                    // await Sender.sendMessage(sender, responder.genFallback());
                }
            }
        }
    }
    return res.sendStatus(200);
});

export default router;


