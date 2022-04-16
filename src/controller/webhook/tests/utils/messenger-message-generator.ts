export class MessengerMessageGenerator {
    private readonly senderId: string;
    private recipientId: string;
    private timestamp: number;
    private messageId: string;
    private text: string;
    private quickReply: {
        payload: string;
    };

    constructor(senderId: string) {
        this.senderId = senderId;
        this.recipientId = '';
        this.timestamp = 1650036539989;
        this.messageId = '';
        this.text = '';

    }

    public withRecipientId(recipientId: string): MessengerMessageGenerator {
        this.recipientId = recipientId;
        return this;
    }

    public withTimestamp(timestamp: number): MessengerMessageGenerator {
        this.timestamp = timestamp;
        return this;
    }

    public withMessageId(messageId: string): MessengerMessageGenerator {
        this.messageId = messageId;
        return this;
    }

    public withText(text: string): MessengerMessageGenerator {
        this.text = text;
        return this;
    }

    public withQuickReply(payload: string): MessengerMessageGenerator {
        this.quickReply = {
            payload
        };
        return this;
    }

    public build(): any {
        return {
            object: "page",
            entry: [{
                id: this.recipientId,
                time: this.timestamp,
                messaging: [{
                    sender: {"id": this.senderId},
                    recipient: {"id": this.recipientId},
                    timestamp: this.timestamp,
                    message: {
                        mid: this.messageId,
                        text: this.text,
                        quick_reply: this.quickReply
                    }
                }]
            }]
        }
    }
}
