import express, {Request, Response} from 'express';
import {ReceivedMessage} from "../../domain/types";


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

interface Responder {
    sendTextMessage(recipientId: string, message: string): Promise<any>;
}


class MessengerResponder  implements Responder {
    constructor(private readonly messengerSenderId: string) {
    }


    async sendTextMessage( message: string): Promise<any> {
        const body = {
            recipient: {
                id: this.messengerSenderId
            },
            message: {
                text: message
            }
        };
        console.log('the response is ', body);
    }
}

router.post('/', async (req: Request<{}, {}, ReceivedMessage>, res: Response) => {
    if (req.body.object === "page") {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                if (event.message?.text) {
                    console.log("event.message.text", event.message.text);
                    const message = event.message.text;
                    const senderId = event.sender.id;
                    const responder = new MessengerResponder(senderId);
                    await responder.sendTextMessage(message);
                }

            }
        }
    }
    return res.sendStatus(200);
});

export default router;