import supertest from 'supertest';
import {app} from "../controller/server";

describe('health-check', () => {


  it('should return 200', async () => {
    const response = await supertest(app).get('/health')

    expect(response.status).toBe(200)
  });

})