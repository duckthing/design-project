// tests/login.test.js

jest.mock('../src/accounts');

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const loginRoute = require('../endpoints/login');
const accountsModule = require('../src/accounts');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Routes
app.get('/login', loginRoute.get);
app.post('/login', loginRoute.post);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

describe('Login Endpoint', () => {
  beforeEach(() => {
    accountsModule.getUserByUsername.mockClear();
    accountsModule.getOrganizerByUsername.mockClear();
  });

  test('GET /login should render login page', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Login');
  });

  test('POST /login with valid user credentials should redirect to user profile management', async () => {
    accountsModule.getUserByUsername.mockImplementation((username) => {
      if (username === 'user') {
        return {
          user_account_id: 1,
          username: 'user',
          password: 'user',
        };
      }
      return null;
    });

    const response = await request(app)
      .post('/login')
      .type('form')
      .send({ username: 'user', password: 'user' });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/user/user-profile-management');
  });

  test('POST /login with invalid credentials should render login page with error', async () => {
    accountsModule.getUserByUsername.mockReturnValue(null);
    accountsModule.getOrganizerByUsername.mockReturnValue(null);

    const response = await request(app)
      .post('/login')
      .type('form')
      .send({ username: 'invalid', password: 'invalid' });

    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('Invalid username or password');
  });

  test('POST /login with incorrect password should return 401 and render error', async () => {
    accountsModule.getUserByUsername.mockImplementation((username) => {
      if (username === 'user') {
        return {
          user_account_id: 1,
          username: 'user',
          password: 'user',
        };
      }
      return null;
    });

    const response = await request(app)
      .post('/login')
      .type('form')
      .send({ username: 'user', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('Invalid password');
  });
});
