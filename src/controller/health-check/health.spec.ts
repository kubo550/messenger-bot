import supertest from 'supertest';
import {app} from "../server";

describe('Health Check', () => {
    beforeEach(() => {
        process.env.stage = 'test';
    })

    afterEach(() => {
        delete process.env.stage;
    })

    it('should return 200 OK', async () => {
        const response = await supertest(app).get('/health');
        expect(response.status).toBe(200);
    });

    it('should work with test stage', async () => {
        const response = await supertest(app).get('/health');
        expect(response.body.stage).toBe('test');
    });
});