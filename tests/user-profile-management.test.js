const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const profileModule = require('../endpoints/user/user-profile-management');  // Adjust the path to match your project

// Set up an Express app for testing
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
}));

// Set up routes for testing
app.get('/user/user-profile-management', profileModule.get);
app.post('/user/user-profile-management', profileModule.post);

describe('User Profile Management Module', () => {

    // Ensure the session is mocked before each test
    beforeEach(() => {
        app.use((req, res, next) => {
            req.session.user = { username: 'user1' };  // Simulate logged-in user
            next();
        });
    });

    // Test for GET request: should return the profile page with default user data
    it('should return the profile page with default data', async () => {
        const res = await request(app).get('/user/user-profile-management');
        expect(res.statusCode).toEqual(200);  // Expect status 200 for a successful GET
        expect(res.text).toContain('John Doe');  // Check for default user data
    });

    // Test for POST request: should update the user profile and redirect
    it('should update the user profile and redirect', async () => {
        const res = await request(app)
            .post('/user/user-profile-management')
            .send({
                fullName: 'Jane Smith',
                address1: '456 New Street',
                address2: '',
                city: 'Dallas',
                state: 'TX',
                skillSelect: ['moving'],  // Array format for skills
                preferences: 'I prefer working outdoors',
                availability: '2024-03-15',
            });

        expect(res.statusCode).toEqual(302);  // Expect redirection after successful update
        expect(res.header.location).toBe('/user/user-profile-management');
    });

    // Test for POST request: should return 400 for missing required fields
    it('should return 400 for missing required fields', async () => {
        const res = await request(app)
            .post('/user/user-profile-management')
            .send({
                fullName: '',  // Missing required fullName
                address1: '789 Fake St',
                city: '',
                state: 'TX',
                skillSelect: ['moving'],
                preferences: '',
                availability: '2024-03-15',
            });

        expect(res.statusCode).toEqual(400);  // Expect validation error
        expect(res.text).toContain("Please fill all required fields.");
    });
});
