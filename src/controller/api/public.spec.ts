import supertest from 'supertest';
import {app} from "../server";
import nock from "nock";

describe('public api', () => {


    describe('send-message', () => {
        let request = {} as any;


        afterEach(() => {
            expect(nock.isDone()).toBeTruthy();
        });

        beforeEach(() => {
            nock.cleanAll();
            request = {}
        })

        afterAll(() => {
            nock.cleanAll();
        })

        it('should send request to facebook api with correct query params', async () => {
            nock('https://graph.facebook.com/v13.0')
                .post('/me/messages')
                .query((params =>
                    params.access_token === 'page-token-abc')
                )
                .reply(200, {status: 200})

            const result = await sendMessage("hello", "123456789");

            expect(result.status).toBe(200);
        });

        it('should send request to facebook api with correct body', async () => {
            nock('https://graph.facebook.com/v13.0')
                .post('/me/messages', (body) => {
                    request = body;
                    return true
                })
                .query(() => true)
                .reply(200, {status: 200})

            await sendMessage("hello", "123456789");

            expect(request).toEqual({
                recipient: {
                    id: "123456789"
                },
                message: {
                    text: "hello"
                }
            });
        });

        it('should return 401 if given credentials are no correct', async () => {
            const result = await sendMessage("hello", "123456789", {username: "invalid", password: "invalid"});

            expect(result.status).toBe(401);
        });


        const sendMessage = (message: string, to: string | string[], {username, password}: {username: string, password: string} = {username: 'test_name', password: 'test_pass'}  ) => supertest(app)
            .post('/api/v1/send-message')
            .send({message, to})
            .set('Authorization', 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'));
    })

})