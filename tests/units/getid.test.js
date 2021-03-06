// tests/unit/getid.test.js

const request = require('supertest');
var path = require('path');

const app = require('../../src/app');
const logger = require('../../src/logger');
var filename;
beforeAll(async () => {
  const res = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('{"This": "is a test"}');

  filename = path.basename(res.headers.location);

  logger.debug({ filename }, ' Fragment Id');
});

describe('GET /v1/fragments/${filename}', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get(`/v1/fragments/${filename}`).expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get(`/v1/fragments/${filename}`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get a Fragment', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${filename}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test('authenticated users get a Fragment converted into html', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${filename}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test('authenticated users gets 415 for converting text into image', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${filename}.png`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(415);
  });

  test('authenticated users gets 200 for converting text into json', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${filename}.json`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });
});
