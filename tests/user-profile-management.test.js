// tests/user-profile-management.test.js

jest.mock('../src/accounts');
jest.mock('../src/skills');
jest.mock('../src/states');

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const userProfile = require('../endpoints/user/user-profile-management');
const accountsModule = require('../src/accounts');
const skillsModule = require('../src/skills');
const statesModule = require('../src/states');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Mock session middleware
app.use((req, res, next) => {
  req.session.isAuthenticated = true;
  req.session.user = {
    username: 'user',
    user_account_id: 1,
  };
  next();
});

// Routes
app.get('/user/user-profile-management', userProfile.get);
app.post('/user/user-profile-management', userProfile.post);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

describe('User Profile Management', () => {
  beforeEach(() => {
    accountsModule.getUserByUsername.mockClear();
    accountsModule.updateUserAccountProfile.mockClear();
    accountsModule.getSkillsByUserID.mockClear();
    accountsModule.getAvailabilityByUserID.mockClear();

    skillsModule.getAllSkills.mockReturnValue([
      { skill_id: 1, skill_name: 'Skill1' },
      { skill_id: 2, skill_name: 'Skill2' },
    ]);

    // Update the mock for statesModule
    statesModule.states = [
      { state_code: 'TS', state_name: 'Test State' },
      { state_code: 'TX', state_name: 'Texas' },
    ];
  });

  test('GET /user/user-profile-management should render profile page for authenticated users', async () => {
    accountsModule.getUserByUsername.mockReturnValue({
      user_account_id: 1,
      username: 'user',
      full_name: 'Test User',
      address1: '123 Test St',
      address2: '',
      city: 'Testville',
      state: 'TS',
      zipcode: '12345',
      preferences: 'No preferences',
    });

    accountsModule.getSkillsByUserID.mockReturnValue([
      { skill_id: 1, skill_name: 'Skill1' },
    ]);

    accountsModule.getAvailabilityByUserID.mockReturnValue([
      { available_at: 1700000000 }, // Mocked timestamp
    ]);

    const response = await request(app).get('/user/user-profile-management');

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Update your profile');
  });

  test('POST /user/user-profile-management should update profile with valid data', async () => {
    accountsModule.getUserByUsername.mockReturnValue({
      user_account_id: 1,
      username: 'user',
    });

    const response = await request(app)
      .post('/user/user-profile-management')
      .type('form')
      .send({
        fullName: 'Test User',
        address1: '123 Test St',
        address2: '',
        city: 'Testville',
        state: 'TS',
        zipcode: '12345',
        preferences: 'No preferences',
        skills: '1,2',
        availability: '2024-01-01,2024-01-02',
      });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/user/user-profile-management');
    expect(accountsModule.updateUserAccountProfile).toHaveBeenCalledWith(
      1, // user_account_id
      'user', // username
      null, // password
      'Test User', // fullName
      '123 Test St', // address1
      '', // address2
      'Testville', // city
      'TS', // state
      '12345', // zipcode
      'No preferences', // preferences
      ['1', '2'], // skills
      ['2024-01-01', '2024-01-02'] // availability
    );
  });

  test('POST /user/user-profile-management should handle missing required fields', async () => {
    const response = await request(app)
      .post('/user/user-profile-management')
      .type('form')
      .send({
        address1: '123 Test St',
        city: 'Testville',
        state: 'TS',
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toContain('Please fill all required fields.');
  });
});
