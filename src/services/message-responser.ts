interface Responder {
    genTextMessage(message: string): Object;
    genQuickReply(text: string, buttons: { title: string, payload: string }[]): Object;
    handlePayload(): Object
    genFallback(): Object;
}


export class MessengerResponder implements Responder {
    public genTextMessage(message: string) {
        return {
            message: {
                text: message
            },
        };

    }

    public genQuickReply(text: string, buttons: { title: string, payload: string }[]) {
        return {
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

    public handlePayload(): Object {
        return this.genQuickReply('Co mogę dla Ciebie zrobić?', [
            {title: 'Plan zajęć', payload: MessagePayload.SCHEDULE},
            {title: 'Zabij dziekana', payload: MessagePayload.KILL},
            {title: 'Inne', payload: MessagePayload.OTHER}
        ]);
    }

    public genFallback() {
        return this.genTextMessage('Przepraszam, coś poszło nie taks. Spróbuj ponownie później.');
    }
}

enum MessagePayload {
    SCHEDULE = 'SCHEDULE',
    KILL = 'KILL',
    OTHER = 'OTHER',
}