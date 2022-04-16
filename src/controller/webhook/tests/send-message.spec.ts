import supertest from "supertest";
import nock from "nock";
import {app} from "../../server";
import {MessengerMessageGenerator} from "./utils/messenger-message-generator";


export type QuickReply = {
    content_type: string,
    title: string,
    payload: string
}


const senderId = 'my-sender-id';
const generateMessage = () => new MessengerMessageGenerator(senderId);

describe('send message', () => {

    beforeAll(() => {
        process.env.apiUrl = 'https://app.com';
        process.env.pageAccessToken = 'page-token';
    })

    beforeEach(() => {
        nock.cleanAll()
    });

    afterEach(() => {
        expect(nock.pendingMocks()).toHaveLength(0)
        expect(nock.isDone()).toBe(true);
    });

    afterAll(() => {
        delete process.env.apiUrl;
        delete process.env.pageAccessToken;
    })


    describe('default simple message', () => {

        it('should send message ', async () => {
            nock(process.env.apiUrl)
                .post('/me/messages')
                .query((query) => {
                    expect(query.access_token).toBe('page-token');
                    return true;
                })
                .reply(200)

            const response = await sendMessage(
                generateMessage().withText('hello').build()
            );

            expect(response.status).toBe(200);
        });

        //     should call graph api with correct parameters
        it('should send message with quick replies', async () => {
            thisBodyWillBeSend(getDefaultMessageResponse('Co mogę dla Ciebie zrobić?', senderId, [{
                title: "Plan zajęć",
                payload: "SCHEDULE"
            }, {
                title: "Zabij dziekana",
                payload: "KILL"
            }, {
                title: "Inne",
                payload: "OTHER"
            }]));

            const response = await sendMessage(
                generateMessage().withText('hello').build()
            );

            expect(response.status).toBe(200);
        });
    });

    describe('quick reply', () => {

        describe('schedule', () => {

            it('should send message with quick replies', async () => {
                thisBodyWillBeSend({
                        message: {
                            text: "Co dokładnie mam sprawdzić?",
                            quick_replies: [
                                {
                                    content_type: "text",
                                    title: "Ten tydzień",
                                    payload: "SCHEDULE_ACTUAL"
                                }, {
                                    content_type: "text",
                                    title: "Kiedy zajęcia",
                                    payload: "SCHEDULE_TERMINAL"
                                }
                            ]
                        },
                        recipient: {id: senderId},
                    }
                );
                const message = generateMessage().withText('Plan zajęć').withQuickReply('SCHEDULE').build();

                const response = await sendMessage(message);

                expect(response.status).toBe(200);
            });

        });


    });


    const sendMessage = async (message: any) =>
        supertest(app)
            .post('/webhook')
            .send(message);

    const getDefaultMessageResponse = (text: string, recipientId: string, quickReplies: Omit<QuickReply, 'content_type'>[]) => ({
        message: {
            text,
            quick_replies: quickReplies.map(qr => ({
                content_type: "text",
                title: qr.title,
                payload: qr.payload
            }))
        },
        recipient: {id: recipientId}
    });

})


function thisBodyWillBeSend(body?: any) {
    nock(process.env.apiUrl)
        .post('/me/messages', body)
        .query((query) => {
            expect(query.access_token).toBe('page-token');
            return true;
        })
        .reply(200)
}