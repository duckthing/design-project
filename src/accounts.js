// src/accounts.js
const dbSource = require("./dbSource");
const db = dbSource.db;

function getUserByUsername(username) {
  const stmt = db.prepare(`
    SELECT * FROM user_accounts WHERE username = ?
  `);
  return stmt.get(username);
}
exports.getUserByUsername = getUserByUsername;

function getUserByUserID(userID) {
  const stmt = db.prepare(`
    SELECT * FROM user_accounts WHERE user_account_id = ?
  `);
  return stmt.get(userID);
}
exports.getUserByUserID = getUserByUserID;

function getUserSkillsFromUserID(userID) {
  const stmt = db.prepare(`
    SELECT s.skill_id, s.skill_name 
    FROM has_skills h 
    INNER JOIN skills s ON h.skill_id = s.skill_id 
    WHERE h.user_account_id = ?
  `);
  return stmt.all(userID);
}
exports.getUserSkillsFromUserID = getUserSkillsFromUserID;

function getUserAvailabilityFromUserID(userID) {
  const stmt = db.prepare(`
    SELECT available_at 
    FROM user_available_at 
    WHERE user_account_id = ?
  `);
  return stmt.all(userID);
}
exports.getUserAvailabilityFromUserID = getUserAvailabilityFromUserID;

function createUserAccount(username, password, fullName, email, address1, city, stateCode, zipcode, preferences) {
  const stmt = db.prepare(`
    INSERT INTO user_accounts (username, password, full_name, email, address1, city, state_code, zipcode, preferences)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(username, password, fullName, email, address1, city, stateCode, zipcode, preferences);
  return getUserByUsername(username);
}
exports.createUserAccount = createUserAccount;

function addSkillToUserID(userID, skillID) {
  const stmt = db.prepare(`
    INSERT INTO has_skills(user_account_id, skill_id) VALUES (?, ?)
  `);
  stmt.run(userID, skillID);
}
exports.addSkillToUserID = addSkillToUserID;

function addAvailabilityToUserID(userID, date) {
  const stmt = db.prepare(`
    INSERT INTO user_available_at(user_account_id, available_at) VALUES (?, ?)
  `);
  stmt.run(userID, date);
}
exports.addAvailabilityToUserID = addAvailabilityToUserID;

function removeAllSkillsFromUserID(userID) {
  const stmt = db.prepare(`
    DELETE FROM has_skills WHERE user_account_id = ?
  `);
  stmt.run(userID);
}
exports.removeAllSkillsFromUserID = removeAllSkillsFromUserID;

function removeAllAvailabilityFromUserID(userID) {
  const stmt = db.prepare(`
    DELETE FROM user_available_at WHERE user_account_id = ?
  `);
  stmt.run(userID);
}
exports.removeAllAvailabilityFromUserID = removeAllAvailabilityFromUserID;

function updateUserAccountProfile(userID, username, password, fullName, address1, address2, city, stateCode, zipcode, preferences, skillIDs, availability) {
  const stmt = db.prepare(`
    UPDATE user_accounts
    SET username = ?, password = ?, full_name = ?, address1 = ?, address2 = ?, city = ?, state_code = ?, zipcode = ?, preferences = ?
    WHERE user_account_id = ?
  `);
  stmt.run(username, password, fullName, address1, address2, city, stateCode, zipcode, preferences, userID);

  removeAllSkillsFromUserID(userID);
  removeAllAvailabilityFromUserID(userID);

  skillIDs.forEach(skillID => {
    addSkillToUserID(userID, skillID);
  });

  availability.forEach(date => {
    addAvailabilityToUserID(userID, date);
  });
}
exports.updateUserAccountProfile = updateUserAccountProfile;

function getOrganizerByUsername(username) {
  const stmt = db.prepare(`
    SELECT * FROM organizer_accounts WHERE username = ?
  `);
  return stmt.get(username);
}
exports.getOrganizerByUsername = getOrganizerByUsername;

function getOrganizerByUserID(userID) {
  const stmt = db.prepare(`
    SELECT * FROM organizer_accounts WHERE organizer_account_id = ?
  `);
  return stmt.get(userID);
}
exports.getOrganizerByUserID = getOrganizerByUserID;

function createOrganizerAccount(username, password) {
  const existingAccount = getOrganizerByUsername(username);
  if (existingAccount) {
    return null;
  }
  const stmt = db.prepare(`
    INSERT INTO organizer_accounts(username, password) VALUES (?,?)
  `);
  stmt.run(username, password);
  return getOrganizerByUsername(username);
}
exports.createOrganizerAccount = createOrganizerAccount;

function getAllUsers() {
  const stmt = db.prepare("SELECT user_account_id FROM user_accounts");
  return stmt.all();
}
exports.getAllUsers = getAllUsers;

function createNotification(userId, message, type = 'New Event') {
  const stmt = db.prepare(`
    INSERT INTO user_notifications (user_account_id, notification_text, dismissed)
    VALUES (?, ?, 0)
  `);
  stmt.run(userId, message);
}
exports.createNotification = createNotification;

function getUserNotifications(userID) {
  const stmt = db.prepare(`
    SELECT notification_id AS id, notification_text AS message, 
    CASE WHEN dismissed = 1 THEN 'Alert' ELSE 'Reminder' END AS type 
    FROM user_notifications 
    WHERE user_account_id = ? 
    ORDER BY notification_id DESC
  `);
  return stmt.all(userID);
}
exports.getUserNotifications = getUserNotifications;

function validateUserCredentials(username, password) {
  const account = getUserByUsername(username);
  return account && account.password === password;
}
exports.validateUserCredentials = validateUserCredentials;

function validateOrganizerCredentials(username, password) {
  const account = getOrganizerByUsername(username);
  return account && account.password === password;
}
exports.validateOrganizerCredentials = validateOrganizerCredentials;

// Default data for the database
if (dbSource.databaseJustCreated) {
  const userData = [
    {
      username: "john",
      password: "john",
      fullName: "John Doe",
      email: "john@example.com",
      address1: "123 Real Street",
      address2: "",
      city: "Houston",
      state: "TX",
      zipcode: "12345",
      skills: [],
      preferences: "No preferences",
      availability: [Math.floor(new Date(2024, 0, 1).getTime() / 1000)],
    },
    {
      username: "user",
      password: "user",
      fullName: "User User",
      email: "user@example.com",
      address1: "123 Also Real Street",
      address2: "",
      city: "Houston",
      state: "TX",
      zipcode: "56789",
      skills: [],
      preferences: "No preferences",
      availability: [Math.floor(new Date(2024, 0, 2).getTime() / 1000)],
    },
  ];

  userData.forEach(d => {
    const account = createUserAccount(
      d.username,
      d.password,
      d.fullName,
      d.email,
      d.address1,
      d.city,
      d.state,
      d.zipcode,
      d.preferences
    );

    if (account) {
      d.skills.forEach(skill => {
        addSkillToUserID(account.user_account_id, skill);
      });
      d.availability.forEach(date => {
        addAvailabilityToUserID(account.user_account_id, date);
      });
    }
  });

  const volunteerHistoryData = [
    {
      user_account_id: 2,
      event_name: "Beach Cleanup",
      event_date: "2024-10-01",
      required_skills: "Teamwork, Environmental Awareness",
      urgency: "High",
      location: "Santa Monica Beach",
      status: "Completed"
    },
    {
      user_account_id: 2,
      event_name: "Community Food Giveaway",
      event_date: "2024-09-20",
      required_skills: "Teamwork",
      urgency: "High",
      location: "Discovery Green",
      status: "Completed"
    },
  ];

  volunteerHistoryData.forEach(d => {
    const stmt = db.prepare(`
      INSERT INTO volunteer_history (user_account_id, event_name, event_date, required_skills, urgency, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(d.user_account_id, d.event_name, d.event_date, d.required_skills, d.urgency, d.location, d.status);
  });

  const organizerData = [
    {
      username: "organizer",
      password: "organizer"
    }
  ];

  organizerData.forEach(d => {
    createOrganizerAccount(d.username, d.password);
  });
}
