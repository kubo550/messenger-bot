import express, {Request, Response} from 'express';
import {ReceivedMessage} from "../../domain/types";
import GraphApi from "../../utils/graph";
import {ResponseFactory} from "../../services/message-responser";


const router = express.Router({mergeParams: true});

router.get('/', (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === process.env.verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


router.post('/', async (req: Request<{}, {}, ReceivedMessage>, res: Response) => {
    console.log("RECEIVED_MESSAGE");
    if (req.body.object === "page") {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                if (event.message?.text) {
                    console.log("event.message.text", event.message.text);
                    const message = event.message.text;
                    const payload = event.message?.quick_reply?.payload;

                    const responder = new ResponseFactory(event.sender?.id).getResponder(payload);
                    const response = await responder.handlePayload();
                    // TODO: handle response as array

                    try {
                        await GraphApi.callSendApi(response);
                    } catch (err) {
                        console.log(err);
                        await GraphApi.callSendApi(responder.genFallback());
                    }
                    return res.sendStatus(200);
                }
            }
        }
    }

    return res.sendStatus(200);
});

export default router;


