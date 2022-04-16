import supertest from "supertest";
import {app} from "../server";
import nock from "nock";


describe('profile', () => {

    afterAll(() => {
        process.env.apiUrl = 'https://app.com';
        process.env.pageId = '123';
        process.env.pageAccessToken = 'page-token';
        process.env.verifyToken = 'verify-token';
    })

    afterEach(() => {
        expect(nock.isDone()).toBeTruthy();
    });

    beforeEach(() => {
        nock.cleanAll();
    })

    afterAll(() => {
        nock.cleanAll();
    })


    it('should return 400 when there is no mode', async  () => {
        const response = await supertest(app).get('/profile')

        expect(response.status).toBe(400);
    })


    it('should return 401 when given verify token is invalid', async  () => {
        const token = 'invalid-token';

        const response = await supertest(app).get(`/profile?mode=test&verify_token=${token}`)

        expect(response.status).toBe(401);
    })

    xit('should set up app when ', async () => {
        nock(`${process.env.apiUrl}/${process.env.appId}`)
            .post('/subscriptions')
            .query(params =>
                params.access_token === 'page-token' &&
                params.object === 'page' &&
                params.callback_url === 'https://app.com/webhook' &&
                params.verify_token === 'verify-token' &&
                params.fields === 'messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals' &&
                params.include_values === 'true')
            .reply(200, {});

        nock(`${process.env.apiUrl}/${process.env.pageId}`)
            .post('/subscribed_apps')
            .query(params =>
                params.access_token === 'page-token' &&
                params.subscribed_fields === 'messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals'
            )
            .reply(200, {})

        const response = await supertest(app).get(`/profile?mode=test&verify_token=verify-token`)

        expect(response.status).toBe(200);
    });

});