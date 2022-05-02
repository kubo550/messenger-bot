import supertest from 'supertest';
import { app } from '../../../server';

describe('webhook-verification', () => {
  beforeAll(() => {
    process.env.verifyToken = 'verify-token';
  });

  afterAll(() => {
    delete process.env.verifyToken;
  });

  it('should return 401 when no token is provided', async () => {
    const response = await verifyWebhook({
      mode: undefined,
      token: undefined,
      challenge: undefined,
    });

    expect(response.status).toEqual(401);
  });

  it('should return 403 when token or mode are invalid', async () => {
    const response = await verifyWebhook({
      mode: 'unknown',
      token: 'invalid-token',
      challenge: undefined,
    });

    expect(response.status).toEqual(403);
  });

  it('should return 200 when token and mode are valid', async () => {
    const response = await verifyWebhook({
      mode: 'subscribe',
      token: 'verify-token',
      challenge: 'challenge',
    });

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('challenge');
  });

  type WebhookVerificationRequest = {
    mode: string;
    token: string;
    challenge: string;
  };

  const verifyWebhook = async ({
    mode,
    token,
    challenge,
  }: Partial<WebhookVerificationRequest>) =>
    supertest(app).get('/webhook').query({
      'hub.mode': mode,
      'hub.verify_token': token,
      'hub.challenge': challenge,
    });
});
