import supertest from 'supertest';
import nock from 'nock';
import { app } from '../../../server';
import { MessengerMessageGenerator } from './utils/messenger-message-generator';
import { GraphApiMock } from './utils/graph-api-mock';

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

    afterEach(() => {
      graphClient.resetSentMessages();
    });

    it('should return 200', async () => {
      graphClient.mockSendMessages();

      const response = await sendMessage(generateMessage().build());

      expect(response.status).toBe(200);
    });

    it('should call api with correct params', async () => {
      graphClient.mockSendMessages();

      await sendMessage(generateMessage().build());

      expect(graphClient.getSentMessagesQueries()).toEqual([
        { access_token: 'page-token' },
      ]);
    });

    it('should send message to user who sent the message', async () => {
      graphClient.mockSendMessages();

      const message = generateMessage().withSenderId('my-sender-id').build();

      await sendMessage(message);

      expect(graphClient.getSentMessages()).toEqual([
        expect.objectContaining({ recipient: { id: 'my-sender-id' } }),
      ]);
    });

    it('should default welcome message contain quick replies', async () => {
      graphClient.mockSendMessages();
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


  describe('quick reply', () => {
    const graphClient = new GraphApiMock();

    beforeEach(() => {
      graphClient.mockSendMessages();
    });

    afterEach(() => {
      graphClient.resetSentMessages();
    });

    describe('schedule', () => {

      it('should send message with quick replies', async () => {
        const message = generateMessage()
          .withText('Plan zajęć')
          .withQuickReply('SCHEDULE')
          .build();

        await sendMessage(message);

        expect(graphClient.getLastSentMessageQuickReplies()).toEqual([
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
        ]);
      });
    });
  });
});


const sendMessage = async (message: any) =>
  supertest(app).post('/webhook').send(message);