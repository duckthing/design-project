const request = require('supertest');
const express = require('express');
const notifications = require('../endpoints/user/notifications');

// Set up the Express app for testing
const app = express();
app.get('/api/notifications', notifications.get);

describe('GET /api/notifications', () => {
  it('should return 200 OK and an array of notifications', async () => {
    const response = await request(app).get('/api/notifications');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.notifications)).toBe(true);
    expect(response.body.notifications.length).toBeGreaterThan(0);

    const notification = response.body.notifications[0];
    expect(notification).toHaveProperty('id');
    expect(notification).toHaveProperty('message');
    expect(notification).toHaveProperty('type');
  });

  it('should validate notification types correctly', () => {
    const invalidNotification = {
      id: 'invalid1',
      message: 'Test invalid notification',
      type: 'Invalid Type',
    };

    const validationError = notifications.validateNotification(invalidNotification);
    expect(validationError).toBe('Invalid type value for notification "invalid1": Invalid Type');
  });
});
