import supertest from 'supertest';
import { app } from '../../server';

describe('sandbox', () => {
  it('should return string', async () => {
    const response = await supertest(app).get('/sandbox');

    expect(response.status).toBe(200);
  });
});
