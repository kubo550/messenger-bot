import nock from 'nock';

export class GraphApiMock {
  private sentMessagesQueries: any[] = [];
  private sentMessages: any[] = [];

  public mockSendMessages() {
    nock(process.env.apiUrl)
      .post('/me/messages', (body: any) => {
        this.sentMessages.push(body);
        return true;
      })
      .query((query) => {
        this.sentMessagesQueries.push(query);
        return true;
      })
      .reply(200);
  }

  public getSentMessages() {
    return this.sentMessages;
  }

  public resetSentMessages() {
    this.sentMessagesQueries = [];
    this.sentMessages = [];
  }

  public getSentMessagesQueries() {
    return this.sentMessagesQueries;
  }

  public getLastSentMessage() {
    return this.sentMessages[this.sentMessages.length - 1];
  }

  public getLastSentMessageText() {
    return this.getLastSentMessage().message.text;
  }

  public getLastSentMessageQuickReplies() {
    return this.getLastSentMessage().message.quick_replies;
  }

}
