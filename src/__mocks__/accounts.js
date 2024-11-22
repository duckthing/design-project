// src/__mocks__/accounts.js

module.exports = {
  getUserByUsername: jest.fn((username) => {
    if (username === 'user') {
      return {
        user_account_id: 1,
        username: 'user',
        password: 'user',
        full_name: 'Test User',
        address1: '123 Test St',
        address2: '',
        city: 'Testville',
        state: 'TS',
        zipcode: '12345',
        preferences: 'No preferences',
      };
    }
    return null;
  }),
  getOrganizerByUsername: jest.fn((username) => {
    if (username === 'organizer') {
      return {
        organizer_account_id: 1,
        username: 'organizer',
        password: 'organizer',
      };
    }
    return null;
  }),
  getUserNotifications: jest.fn((user_account_id) => [
    {
      id: 'notif1',
      message: 'Test notification',
      type: 'New Event',
    },
  ]),
  updateUserAccountProfile: jest.fn(),
  getSkillsByUserID: jest.fn(() => [
    { skill_id: 1, skill_name: 'Skill1' },
  ]),
  getAvailabilityByUserID: jest.fn(() => [
    { available_at: 1700000000 },
  ]),
  dismissNotification: jest.fn(),
  // Add other functions as needed
};
