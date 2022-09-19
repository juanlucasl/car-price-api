import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const mockMail = 'mock@mail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockMail, password: 'dummy' })
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mockMail);
      });
  });

  it("signs up a new user and gets it's session", async () => {
    const mockMail = 'mock@mail.com';

    // Signup as a new user and get a session cookie.
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockMail, password: 'dummy' })
      .expect(201);
    const cookie = signupResponse.get('Set-Cookie');

    // Send a request to /auth/whoami with the session cookie.
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    // Expect the User to be signed-in and their id and user email to exist in
    // the response from /auth/whoami
    expect(body.id).toBeDefined();
    expect(body.email).toEqual(mockMail);
  });
});
