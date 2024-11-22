// src/__mocks__/states.js

module.exports = {
    getAllStates: jest.fn(() => [
      { state_code: 'TS', state_name: 'Test State' },
      { state_code: 'TX', state_name: 'Texas' },
    ]),
  };
  