import express, {Request, Response} from 'express';
import {ReceivedMessage} from "../../domain/types";
import GraphApi from "../../utils/graph";
import {LessonShortName, ScheduleApiClient} from "../../services/schedule";
import moment from "moment";


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
                        const payload = event.message?.quick_reply?.payload;
                        try {
                            // todo: move to separate class
                            if (payload) {
                                if (payload.toUpperCase() === 'SCHEDULE' ) {
                                    await responder.quickReply('Co dokładnie mam sprawdzić?', [
                                        {title: 'Ten tydzień', payload: 'SCHEDULE_ACTUAL'},
                                        {title: 'Kiedy zajęcia', payload: 'SCHEDULE_TERMINAL'},
                                    ], 300);

                                    return res.sendStatus(200);
                                }else if (payload.toUpperCase() === 'SCHEDULE_ACTUAL') {
                                    await responder.quickReply('Która grupa?', [
                                        {title: 'Pierwsza', payload: 'SCHEDULE_ACTUAL_190201'},
                                        {title: 'Druga', payload: 'SCHEDULE_ACTUAL_190271'},
                                    ], 300);

                                    return res.sendStatus(200);
                                } else if (payload.toUpperCase().includes('SCHEDULE_ACTUAL_')) {
                                    const groupId = payload.toUpperCase().replace('SCHEDULE_ACTUAL_', '');
                                    const scheduleClient = new ScheduleApiClient(groupId);
                                    const schedule = await scheduleClient.getActualScheduleForGroup();
                                    const message = schedule.map(({date, day, subject, teacher, room,from}) => `${onlyMonthAndDay(date)} ${day} ${from} ${subject}  ${teacher || ''} ${generateClass(room)}`).join('\n');
                                    await responder.sendTextMessage(`W tym tygodniu masz ${schedule.length} zajęć:`);
                                    await responder.sendTextMessage(message, 300);

                                    return res.sendStatus(200);
                                } else if (payload.toUpperCase() === 'SCHEDULE_TERMINAL') {
                                    await responder.quickReply('Który przedmiot?', [
                                        {title: 'Pracownia Programowania', payload: 'SCHEDULE_TERMINAL_PRACOWNIA'},
                                        {title: 'Ekonomia', payload: 'SCHEDULE_TERMINAL_EKONOMIA'},
                                        {title: 'Matematika', payload: 'SCHEDULE_TERMINAL_MATEMATYKA'},
                                        {title: 'Statystyka', payload: 'SCHEDULE_TERMINAL_STATYSTYKA'},
                                        {title: 'Dobre praktyki', payload: 'SCHEDULE_TERMINAL_PRAKTYKI'},
                                        {title: 'Wstep do systemow', payload: 'SCHEDULE_TERMINAL_SYSTEMY'},
                                        {title: 'Angielski', payload: 'SCHEDULE_TERMINAL_ANGIELSKI'},
                                    ], 300);

                                    return res.sendStatus(200);
                                }else if (payload.toUpperCase().includes('SCHEDULE_TERMINAL_')){
                                    const lessonShortName = payload.replace('SCHEDULE_TERMINAL_', '').toLowerCase() as LessonShortName;
                                    const scheduleClient = new ScheduleApiClient('190201');
                                    const schedule = await scheduleClient.getLessonsTerminal(lessonShortName);
                                    const message = schedule.map(({day,date, teacher, room,from}) => `${onlyMonthAndDay(date)} ${day} ${from} ${teacher || ''} ${generateClass(room)}`).join('\n');
                                    await responder.sendTextMessage(`Łącznie ${uppercaseFirstLetter(lessonShortName)} masz ${schedule.length} zajęć:`);
                                    await responder.sendTextMessage(message, 300);

                                    return res.sendStatus(200);
                                }
                            }
                            await responder.quickReply('Co mogę dla Ciebie zrobić?', [
                                {title: 'Plan zajęć', payload: 'SCHEDULE'},
                                {title: 'Zabij dziekana', payload: 'KILL'},
                                {title: 'Inne', payload: 'OTHER'},
                            ], 300);

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

function generateClass(str: string | undefined) {
    if (!str) {
        return '';
    }
    if (str.includes('<a href=')) {
        return 'Wykład';
    }
    return str;
}
function uppercaseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function onlyMonthAndDay(date: string) {
    return moment(date, 'YYYY-MM-DD').format('MM-DD');
}