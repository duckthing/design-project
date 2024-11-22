// tests/volunteer-history.test.js
const { validateEvent } = require('../endpoints/organizer/volunteer-history');

describe('Volunteer History Validation', () => {
  test('should validate a correct event successfully', () => {
    const validEvent = {
      eventName: 'Valid Event',
      date: '2024-01-01',
      requiredSkills: 'Skill1',
      urgency: 'High',
      location: 'Test Location',
      status: 'Completed',
    };
    const validationError = validateEvent(validEvent);
    expect(validationError).toBeNull();
  });

  test('should return error for event with missing fields', () => {
    const invalidEvent = {
      eventName: 'Invalid Event',
      date: '2024-01-01',
      // Missing requiredSkills
      urgency: 'High',
      location: 'Test Location',
      status: 'Completed',
    };
    const validationError = validateEvent(invalidEvent);
    expect(validationError).toBe('Missing required field: requiredSkills');
  });

  test('should return error for event with invalid status', () => {
    const invalidEvent = {
      eventName: 'Invalid Event',
      date: '2024-01-01',
      requiredSkills: 'Skill1',
      urgency: 'High',
      location: 'Test Location',
      status: 'InvalidStatus',
    };
    const validationError = validateEvent(invalidEvent);
    expect(validationError).toBe('Invalid status value for event "Invalid Event": InvalidStatus');
  });
});
