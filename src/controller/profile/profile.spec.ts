import supertest from "supertest";
import {app} from "../server";
import nock from "nock";


describe('profile', () => {


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
        const response = await supertest(app).get('/profile?mode=test&verify_token=invalidToken')

        expect(response.status).toBe(401);
    })

    it('should set up app when ', async () => {
        nock(`${process.env.apiUrl}/${process.env.appId}`)
            .post('/subscriptions')
            .query(params =>
                params.access_token === 'page-token-abc' &&
                params.object === 'page' &&
                params.callback_url === 'https://app.com/webhook' &&
                params.verify_token === 'token-abc' &&
                params.fields === 'messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals' &&
                params.include_values === 'true')
            .reply(200, {});

        nock(`${process.env.apiUrl}/${process.env.pageId}`)
            .post('/subscribed_apps')
            .query(params =>
                params.access_token === 'page-token-abc' &&
                params.subscribed_fields === 'messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals'
            )
            .reply(200, {})

        const response = await supertest(app).get('/profile?mode=test&verify_token=token-abc')

        expect(response.status).toBe(200);
    });

});