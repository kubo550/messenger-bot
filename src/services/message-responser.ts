interface Responder {
  genTextMessage(message: string): { [key: string]: any };

  genQuickReply(
    text: string,
    buttons: { title: string; payload: string }[],
  ): { [key: string]: any };

  handlePayload(): { [key: string]: any };

  genFallback(): { [key: string]: any };
}

export class MessengerResponder implements Responder {
  public genTextMessage(message: string) {
    return {
      message: {
        text: message,
      },
    };
  }

  public genQuickReply(
    text: string,
    buttons: { title: string; payload: string }[],
  ) {
    return {
      message: {
        text,
        quick_replies: buttons.map(({ title, payload }) => ({
          content_type: 'text',
          title,
          payload,
        })),
      },
    };
  }

  public handlePayload(): { [key: string]: any } {
    return this.genQuickReply('Co mogę dla Ciebie zrobić?', [
      { title: 'Plan zajęć', payload: MessagePayload.SCHEDULE },
      { title: 'Zabij dziekana', payload: MessagePayload.KILL },
      { title: 'Inne', payload: MessagePayload.OTHER },
    ]);
  }

  public genFallback() {
    return this.genTextMessage(
      'Przepraszam, coś poszło nie taks. Spróbuj ponownie później.',
    );
  }
}

enum MessagePayload {
  SCHEDULE = 'SCHEDULE',
  KILL = 'KILL',
  OTHER = 'OTHER',
}
