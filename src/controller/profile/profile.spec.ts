import supertest from 'supertest';
import { app } from '../server';
import nock from 'nock';

describe('profile', () => {
  beforeAll(() => {
    process.env.apiUrl = 'https://app.com';
    process.env.pageId = '123';
    process.env.pageAccessToken = 'page-token';
    process.env.verifyToken = 'verify-token';
    process.env.appId = 'app-id';
  });

  afterEach(() => {
    expect(nock.isDone()).toBeTruthy();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('should return 400 when there is no mode', async () => {
    const response = await supertest(app).get('/profile');

    expect(response.status).toBe(400);
  });

  it('should return 401 when given verify token is invalid', async () => {
    const token = 'invalid-token';

    const response = await supertest(app).get(
      `/profile?mode=test&verify_token=${token}`,
    );

    expect(response.status).toBe(401);
  });

  xit('should set up app with correct parameters', async () => {
    const response = await supertest(app).get(
      `/profile?mode=test&verify_token=verify-token`,
    );

    expect(response.status).toBe(200);
  });
});
