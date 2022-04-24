import GraphApi from '../utils/graph';

export class Sender {
  static async sendMessage(recipientId: string, messages: any, delay = 0) {
    if (Array.isArray(messages)) {
      for await (const message of messages) {
        await Sender.sendMessage(recipientId, message, delay + 1_000);
      }
    } else {
      const messageData = {
        ...messages,
        recipient: {
          id: recipientId,
        },
      };
      await GraphApi.callSendApi(messageData);
    }
  }
}
