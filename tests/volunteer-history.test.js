const request = require('supertest');
const express = require('express');
const volunteerHistory = require('../endpoints/organizer/volunteer-history');

const app = express();
app.get('/api/volunteer-history', volunteerHistory.get);

describe('GET /api/volunteer-history', () => {
  it('should return 200 OK and an array of volunteer history events', async () => {
    const response = await request(app).get('/api/volunteer-history');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.events.length).toBeGreaterThan(0);

    const event = response.body.events[0];
    expect(event).toHaveProperty('eventName');
    expect(event).toHaveProperty('date');
    expect(event).toHaveProperty('requiredSkills');
    expect(event).toHaveProperty('urgency');
    expect(event).toHaveProperty('location');
    expect(event).toHaveProperty('status');
  });

  it('should validate event data correctly', () => {
    const invalidEvent = {
      eventName: 'Invalid Event',
      date: '',
      requiredSkills: 'Invalid Skill',
      urgency: 'Unknown',
      location: 'Unknown Location',
      status: 'Unknown',
    };

    const validationError = volunteerHistory.validateVolunteerHistory(invalidEvent);
    expect(validationError).toContain('Invalid status value for event');
  });
});
