// src/accounts.js

const db = require('./dbSource');
const bcrypt = require('bcrypt');

// Function to get a user by username
function getUserByUsername(username) {
  const stmt = db.prepare(`
    SELECT *
    FROM user_accounts
    WHERE username = ?
  `);
  const user = stmt.get(username);
  return user || null;
}

// Function to get an organizer by username
function getOrganizerByUsername(username) {
  const stmt = db.prepare(`
    SELECT *
    FROM organizer_accounts
    WHERE username = ?
  `);
  const organizer = stmt.get(username);
  return organizer || null;
}

// Function to create a new user account
function createUserAccount(
  username,
  password,
  fullName,
  address1,
  address2,
  city,
  state,
  zipcode,
  preferences
) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO user_accounts (
      username,
      password,
      full_name,
      address1,
      address2,
      city,
      state,
      zipcode,
      preferences
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    username,
    hashedPassword,
    fullName,
    address1,
    address2,
    city,
    state,
    zipcode,
    preferences
  );

  return { user_account_id: result.lastInsertRowid };
}

// Function to create a new organizer account
function createOrganizerAccount(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO organizer_accounts (
      username,
      password
    )
    VALUES (?, ?)
  `);

  const result = stmt.run(username, hashedPassword);

  return { organizer_account_id: result.lastInsertRowid };
}

// Function to update user account profile
function updateUserAccountProfile(
  user_account_id,
  username,
  password,
  fullName,
  address1,
  address2,
  city,
  state,
  zipcode,
  preferences,
  skills,
  availability
) {
  const updateStmt = db.prepare(`
    UPDATE user_accounts
    SET
      full_name = ?,
      address1 = ?,
      address2 = ?,
      city = ?,
      state = ?,
      zipcode = ?,
      preferences = ?
    WHERE user_account_id = ?
  `);

  updateStmt.run(
    fullName,
    address1,
    address2,
    city,
    state,
    zipcode,
    preferences,
    user_account_id
  );

  // Update skills
  const deleteSkillsStmt = db.prepare(`
    DELETE FROM user_skills
    WHERE user_account_id = ?
  `);
  deleteSkillsStmt.run(user_account_id);

  const insertSkillStmt = db.prepare(`
    INSERT INTO user_skills (user_account_id, skill_id)
    VALUES (?, ?)
  `);

  skills.forEach((skill_id) => {
    insertSkillStmt.run(user_account_id, skill_id);
  });

  // Update availability
  const deleteAvailabilityStmt = db.prepare(`
    DELETE FROM user_availability
    WHERE user_account_id = ?
  `);
  deleteAvailabilityStmt.run(user_account_id);

  const insertAvailabilityStmt = db.prepare(`
    INSERT INTO user_availability (user_account_id, available_at)
    VALUES (?, ?)
  `);

  availability.forEach((dateStr) => {
    const date = new Date(dateStr);
    const timestamp = Math.floor(date.getTime() / 1000);
    insertAvailabilityStmt.run(user_account_id, timestamp);
  });
}

// Function to get skills by user ID
function getSkillsByUserID(user_account_id) {
  const stmt = db.prepare(`
    SELECT s.skill_id, s.skill_name
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.skill_id
    WHERE us.user_account_id = ?
  `);
  const skills = stmt.all(user_account_id);
  return skills;
}

// Function to get availability by user ID
function getAvailabilityByUserID(user_account_id) {
  const stmt = db.prepare(`
    SELECT available_at
    FROM user_availability
    WHERE user_account_id = ?
  `);
  const availability = stmt.all(user_account_id);
  return availability;
}

// Function to get user notifications
function getUserNotifications(user_account_id) {
  const stmt = db.prepare(`
    SELECT *
    FROM notifications
    WHERE user_account_id = ?
  `);
  const notifications = stmt.all(user_account_id);
  return notifications;
}

// Function to dismiss a notification
function dismissNotification(notification_id) {
  const stmt = db.prepare(`
    DELETE FROM notifications
    WHERE notification_id = ?
  `);
  stmt.run(notification_id);
}

// Function to verify user password
function verifyUserPassword(username, password) {
  const user = getUserByUsername(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return null;
}

// Function to verify organizer password
function verifyOrganizerPassword(username, password) {
  const organizer = getOrganizerByUsername(username);
  if (organizer && bcrypt.compareSync(password, organizer.password)) {
    return organizer;
  }
  return null;
}

// Export all functions
module.exports = {
  getUserByUsername,
  getOrganizerByUsername,
  createUserAccount,
  createOrganizerAccount,
  updateUserAccountProfile,
  getSkillsByUserID,
  getAvailabilityByUserID,
  getUserNotifications,
  dismissNotification,
  verifyUserPassword,
  verifyOrganizerPassword,
  // Add other exports as needed
};
