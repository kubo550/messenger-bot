import express, {Request, Response} from 'express';
import {ReceivedMessage} from "../../domain/types";
import GraphApi from "../../utils/graph";
// import {generateGroupUrl, getScheduleForGroup} from "../../services/schedule";


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
    sendTextMessage(message: string, delay?: number): Promise<any>;
}


export class MessengerResponder implements Responder {
    constructor(private readonly messengerSenderId: string) {
    }


    async sendTextMessage(message: string, delay = 0): Promise<any> {
        const responseBody = {
            recipient: {
                id: this.messengerSenderId
            },
            message: {
                text: message
            },
        };

        return GraphApi.callSendApi(responseBody)
    }

    async quickReply(text: string, quickReplies: { title: string, payload: string }[], delay = 0): Promise<any> {
        const responseBody = {
            recipient: {
                id: this.messengerSenderId
            },
            message: {
                text,
                quick_replies: quickReplies.map(({title, payload}) => ({
                    content_type: "text",
                    title,
                    payload
                }))
            },
        };

        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return GraphApi.callSendApi(responseBody)
    }
}

router.post('/', async (req: Request<{}, {}, ReceivedMessage>, res: Response) => {
    console.log("RECEIVED_MESSAGE");
    if (req.body.object === "page") {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {

                try {
                    const responder = new MessengerResponder(event.sender?.id);
                    // todo: use switch or something else to handle different message types
                    if (event.message?.text) {
                        console.log("event.message.text", event.message.text);
                        const message = event.message.text;
                        try {
                            await responder.sendTextMessage(message);

                            // to send message with pool
                            // await responder.quickReply('Kiedy chcesz mieć angielski?', [
                            //     {title: 'dziś', payload: 'Q1_GOOD'},
                            //     {title: 'jutro', payload: 'Q1_TOMORROW'},
                            //     {title: 'pojutrze', payload: 'Q1_DAYAFTER'},
                            // ], 300);

                            // TODO: move to separate file
                            // const classes = await getScheduleForGroup(process.env.group_01_id);
                            // if (classes.length > 0) {
                            //     await responder.sendTextMessage(`W ten weekend masz ${classes.length} zajęć:`);
                            //     for await (const [idx, l] of classes.entries()) {
                            //         await responder.sendTextMessage(`${l.day} ${l.date}  ${l.from} - ${l.to} \n${l.subject} (${l.type}) \n${l.teacher || ''} ${l.room.includes('<a href=') ? '(Zdalnie)' : l.room || ''}`, (idx + 1) * 500);
                            //     }
                            //
                            // } else {
                            //     await responder.sendTextMessage("Ten weekend masz wolny szefie ");
                            //     await responder.sendTextMessage(`Sprawdź swój plan zajęć na stronie ${generateGroupUrl(process.env.group_01_id)}`);
                            // }
                        } catch (err) {
                            await responder.sendTextMessage('kuuuuurwa sorry coś poszło nie tak')
                            console.log(err);
                        }
                        return res.sendStatus(200);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    return res.sendStatus(200);
});

export default router;