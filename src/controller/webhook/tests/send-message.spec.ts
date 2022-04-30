import supertest from 'supertest';
import nock from 'nock';
import { app } from '../../server';
import { MessengerMessageGenerator } from './utils/messenger-message-generator';
import { GraphApiMock } from './utils/graph-api-mock';

export type QuickReply = {
  content_type: string;
  title: string;
  payload: string;
};

const generateMessage = () => new MessengerMessageGenerator();

describe('send message', () => {
  beforeAll(() => {
    process.env.apiUrl = 'https://app.com';
    process.env.pageAccessToken = 'page-token';
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    expect(nock.pendingMocks()).toHaveLength(0);
    expect(nock.isDone()).toBe(true);
  });

  afterAll(() => {
    delete process.env.apiUrl;
    delete process.env.pageAccessToken;
  });

  describe('default simple message', () => {
    const graphClient = new GraphApiMock();

    beforeEach(() => {
      graphClient.mockSendMessages();
    });

    afterEach(() => {
      graphClient.resetSentMessages();
    });

    it('should return 200', async () => {
      const response = await sendMessage(generateMessage().build());

      expect(response.status).toBe(200);
    });

    it('should call api with correct params', async () => {
      await sendMessage(generateMessage().build());

      expect(graphClient.getSentMessagesQueries()).toEqual([
        { access_token: 'page-token' },
      ]);
    });

    it('should send message to user who sent the message', async () => {
      const message = generateMessage().withSenderId('my-sender-id').build();

      await sendMessage(message);

      expect(graphClient.getSentMessages()).toEqual([
        expect.objectContaining({ recipient: { id: 'my-sender-id' } }),
      ]);
    });

    it('should default welcome message contain quick replies', async () => {
      const defaultWelcomeMessage = 'Co mogę dla Ciebie zrobić?';

      await sendMessage(generateMessage().withText('hello').build());

      expect(graphClient.getLastSentMessageText()).toEqual(defaultWelcomeMessage);
      expect(graphClient.getLastSentMessageQuickReplies()).toEqual([
        {
          content_type: 'text',
          payload: 'SCHEDULE',
          title: 'Plan zajęć',
        },
        {
          content_type: 'text',
          payload: 'KILL',
          title: 'Zabij dziekana',
        },
        {
          content_type: 'text',
          payload: 'OTHER',
          title: 'Inne',
        },
      ]);
    });
  });


  // todo refactor this tests
  describe('quick reply', () => {
    describe('schedule', () => {
      it('should send message with quick replies', async () => {
        thisBodyWillBeSend({
          message: {
            text: 'Co dokładnie mam sprawdzić?',
            quick_replies: [
              {
                content_type: 'text',
                title: 'Ten tydzień',
                payload: 'SCHEDULE_ACTUAL',
              },
              {
                content_type: 'text',
                title: 'Kiedy zajęcia',
                payload: 'SCHEDULE_TERMINAL',
              },
            ],
          },
          recipient: { id: 'my-sender-id' },
        });
        const message = generateMessage()
          .withText('Plan zajęć')
          .withQuickReply('SCHEDULE')
          .build();

        const response = await sendMessage(message);

        expect(response.status).toBe(200);
      });
    });
  });

  const sendMessage = async (message: any) =>
    supertest(app).post('/webhook').send(message);

  const getDefaultMessageResponse = (
    text: string,
    recipientId: string,
    quickReplies: Omit<QuickReply, 'content_type'>[],
  ) => ({
    message: {
      text,
      quick_replies: quickReplies.map((qr) => ({
        content_type: 'text',
        title: qr.title,
        payload: qr.payload,
      })),
    },
    recipient: { id: recipientId },
  });
});

function thisBodyWillBeSend(body?: any) {
  nock(process.env.apiUrl)
    .post('/me/messages', body)
    .query((query) => {
      expect(query.access_token).toBe('page-token');
      return true;
    })
    .reply(200);
}
