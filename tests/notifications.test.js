// tests/notifications.test.js

jest.mock('../src/accounts');

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const notifications = require('../endpoints/user/notifications');
const accountsModule = require('../src/accounts');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  req.session.isAuthenticated = true;
  req.session.user = {
    user_account_id: 1,
  };
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Routes
app.get('/api/notifications', notifications.get);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

describe('GET /api/notifications', () => {
  beforeEach(() => {
    accountsModule.getUserNotifications.mockClear();
  });

  test('should return 200 OK and an array of notifications', async () => {
    accountsModule.getUserNotifications.mockReturnValue([
      {
        id: 'notif1',
        message: 'Test notification',
        type: 'New Event',
      },
    ]);

    const response = await request(app).get('/api/notifications');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.notifications)).toBe(true);
    expect(response.body.notifications.length).toBeGreaterThan(0);

    const notification = response.body.notifications[0];
    expect(notification).toHaveProperty('id');
    expect(notification).toHaveProperty('message');
    expect(notification).toHaveProperty('type');
  });

  test('should handle database errors gracefully', async () => {
    accountsModule.getUserNotifications.mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/api/notifications');

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Internal Server Error');
  });
});
