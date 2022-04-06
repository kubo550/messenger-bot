import {ScheduleResponder} from "./schedule-responser";

interface Responder {
    genTextMessage(message: string): Object;

    genQuickReply(text: string, buttons: { title: string, payload: string }[]): Object;

    handlePayload(): Object
    genFallback(): Object;
}


export class MessengerResponder implements Responder {
    constructor(private readonly messengerSenderId: string) {
    }


    genTextMessage(message: string) {
        return {
            recipient: {
                id: this.messengerSenderId
            },
            message: {
                text: message
            },
        };

    }

    genQuickReply(text: string, buttons: { title: string, payload: string }[]) {
        return {
            recipient: {
                id: this.messengerSenderId
            },
            message: {
                text,
                quick_replies: buttons.map(({title, payload}) => ({
                    content_type: "text",
                    title,
                    payload
                }))
            },
        }
    }

    handlePayload(): Object {
        return this.genQuickReply('Co mogę dla Ciebie zrobić?', [
            {title: 'Plan zajęć', payload: 'SCHEDULE'},
            {title: 'Zabij dziekana', payload: 'KILL'},
            {title: 'Inne', payload: 'OTHER'},
        ]);
    }

    genFallback() {
        return this.genTextMessage('Przepraszam, coś poszło nie taks. Spróbuj ponownie później.');
    }
}

enum ResponsePayload {
    SCHEDULE = "SCHEDULE",
}

export class ResponseFactory {
    constructor(private readonly senderId: string) {
    }


    public getResponder(payload: string) {
        // TODO: Default responder should ask for any help or something like that
        if (!payload) {
            return new MessengerResponder(this.senderId);
        } else if (payload.includes(ResponsePayload.SCHEDULE)) {
            return new ScheduleResponder(this.senderId, payload);
        } else {
            return new MessengerResponder(this.senderId)
        }
    }


}
