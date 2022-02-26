import supertest from "supertest";
import {app} from "../controller/server";
import nock from "nock";

describe('RandomPerson', () => {

  it('should return a random person',async () => {
    nock('https://randomuser.me/api/').get('/').reply(200, {
      results: [
        {
          "gender": "female",
          "name": {
            "title": "Ms",
            "first": "Linnea",
            "last": "Lampo"
          },
          "email": "linnea.lampo@example.com",
        }
      ]
    })

      const response = await randomPerson();

      expect(response.status).toBe(200);
      expect(response.body.result).toHaveProperty('name');
      expect(response.body.result).toHaveProperty('gender');
      expect(response.body.result).toHaveProperty('email');

  })

  it('should return 500 when random-user.api return 400\n', async () => {
    nock('https://randomuser.me/api/').get('/').reply(400);

    const response = await randomPerson();

    expect(response.status).toBe(500);
  })


  const randomPerson = () => supertest(app).get('/random-person');

});