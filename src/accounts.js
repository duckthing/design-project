const dbSource = require("./dbSource");
const db = dbSource.db;

class UserAccount {
	constructor(username, password, fullName, address1, address2, city, state, skills, preferences, availability) {
		this.username = username;
		this.password = password;
		this.fullName = fullName;
		this.address1 = address1;
		this.address2 = address2;
		this.city = city;
		this.state = state;
		this.skills = skills;
		this.preferences = preferences;
		this.availability = availability;
	}
}

class OrganizerAccount {
	constructor(username, password) {
		this.username = username;
		this.password = password;
	}
}

const getUserByUsernameStmt = db.prepare(`
	SELECT * FROM user_accounts WHERE username = ?
`);
function getUserByUsername(username) {
	return getUserByUsernameStmt.get(username);
}
exports.getUserByUsername = getUserByUsername;

const getUserByUserIDStmt = db.prepare(`
	SELECT * FROM user_accounts WHERE user_account_id = ?
`);
function getUserByUserID(username) {
	return getUserByUserIDStmt.get(username);
}

const getUserSkillsFromUserIDStmt = db.prepare(`
	SELECT s.skill_id, s.skill_name FROM has_skills h INNER JOIN skills s ON h.skill_id = s.skill_id WHERE h.user_account_id = ?
`);
function getUserSkillsFromUserID(userID) {
	return getUserSkillsFromUserIDStmt.all(userID);
}
exports.getUserSkillsFromUserID = getUserSkillsFromUserID;

const getUserAvailabilityFromUserIDStmt = db.prepare(`
	SELECT available_at FROM user_available_at a INNER JOIN user_accounts u ON u.user_account_id = a.user_account_id WHERE u.user_account_id = ?
`);
function getUserAvailabilityFromUserID(userID) {
	return getUserAvailabilityFromUserIDStmt.all(userID);
}
exports.getUserAvailabilityFromUserID = getUserAvailabilityFromUserID;

const createUserAccountStmt = db.prepare(`
	INSERT INTO user_accounts(username, password, full_name, address1, city, state_code, zipcode, preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);	
function createUserAccount(username, password, fullName, email, address1, city, stateCode, zipcode, preferences) {
	try {
		const stmt = db.prepare(`
			INSERT INTO user_accounts (username, password, full_name, email, address1, city, state_code, zipcode, preferences)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);
		
		stmt.run(username, password, fullName, email, address1, city, stateCode, zipcode, preferences);
		return true;
	} catch (error) {
		console.error("Error creating user account:", error);
		return false;
	}
}
exports.createUserAccount = createUserAccount;

const addSkillToUserIDStmt = db.prepare(`
	INSERT INTO has_skills(user_account_id, skill_id) VALUES (?, ?)
`);	
function addSkillToUserID(userID, skillID) {
	addSkillToUserIDStmt.run(userID, skillID);
}
exports.addSkillToUserID = addSkillToUserID;

const addAvailabilityToUserIDStmt = db.prepare(`
	INSERT INTO user_available_at(user_account_id, available_at) VALUES (?, ?)
`);	
function addAvailabilityToUserID(userID, date) {
	addAvailabilityToUserIDStmt.run(userID, date);
}
exports.addAvailabilityToUserID = addAvailabilityToUserID;

const removeAllSkillsFromUserIDStmt = db.prepare(`
	DELETE FROM has_skills WHERE user_account_id = ?
`);	
function removeAllSkillsFromUserID(userID) {
	removeAllSkillsFromUserIDStmt.run(userID);
}
exports.removeAllSkillsFromUserID = removeAllSkillsFromUserID;

const removeAllAvailabilityFromUserIDStmt = db.prepare(`
	DELETE FROM user_available_at WHERE user_account_id = ?
`);	
function removeAllAvailabilityFromUserID(userID) {
	removeAllAvailabilityFromUserIDStmt.run(userID);
}
exports.removeAllAvailabilityFromUserID = removeAllAvailabilityFromUserID;

const updateUserAccountProfileStmt = db.prepare(`
	UPDATE user_accounts
	SET username = ?, password = ?, full_name = ?, address1 = ?, address2 = ?, city = ?, state_code = ?, zipcode = ?, preferences = ?
	WHERE user_account_id = ?
`);	
function updateUserAccountProfile(userID, username, password, fullName, address1, address2 = "", city, stateCode, zipcode, preferences = "", skillIDs = [], availability = []) {
	removeAllSkillsFromUserID(userID);
	removeAllAvailabilityFromUserID(userID);
	updateUserAccountProfileStmt.run(username, password, fullName, address1, address2, city, stateCode, zipcode, preferences, userID);
	for (skillID of skillIDs) {
		addSkillToUserID(userID, skillID);
	}
	for (date of availability) {
		// Convert things into SQL values
		let realDateVal;
		if (typeof date == "object") {
			// (most likely a Date object)
			// Divide by 1000 to get seconds, not milliseconds
			realDateVal = Math.floor(date.getTime() * 0.001);
		} else {
			// If it's a number
			realDateVal = date;
		}
		addAvailabilityToUserID(userID, realDateVal);
	}
}
exports.updateUserAccountProfile = updateUserAccountProfile;

function validateUserCredentials(username, password) {
	const account = getUserAccount(username);
	if (account && account.password === password) {
		return true;
	}
	return false;
}

const getOrganizerByUsernameStmt = db.prepare(`
	SELECT * FROM organizer_accounts WHERE username = ?
`);	
function getOrganizerByUsername(username) {
	return getOrganizerByUsernameStmt.get(username);
}
exports.getOrganizerByUsername = getOrganizerByUsername;

const getOrganizerByUserIDStmt = db.prepare(`
	SELECT * FROM organizer_accounts WHERE organizer_account_id = ?
`);	
function getOrganizerByUserID(userID) {
	return getOrganizerByUserIDStmt.get(userID);
}
exports.getOrganizerByUsername = getOrganizerByUsername;


const createOrganizerAccountStmt = db.prepare(`
	INSERT INTO organizer_accounts(username, password) VALUES (?,?)
`);	
function createOrganizerAccount(username, password) {
	// TODO: Validate input
	const account = getOrganizerByUsername(username);
	if (account) {
		return null;
	} else {
		// Create the account
		const info = createOrganizerAccountStmt.run(username, password);
		return getOrganizerByUserID(info.lastInsertRowid);
	}
}
exports.createOrganizerAccount = createOrganizerAccount;

function validateOrganizerCredentials(username, password) {
	const account = getOrganizerAccount(username);
	if (account && account.password === password) {
		return true;
	}
	return false;
}

function getAllUsers() {
	return db.prepare("SELECT user_account_id FROM user_accounts").all();
}
exports.getAllUsers = getAllUsers;

// Create a notification for a user (added function)
const createNotificationStmt = db.prepare(`
	INSERT INTO user_notifications (user_account_id, notification_text, dismissed)
	VALUES (?, ?, 0)
`);
function createNotification(userId, message, type = 'New Event') {
	createNotificationStmt.run(userId, message);
}
exports.createNotification = createNotification;

const getUserNotificationsStmt = db.prepare(`
	SELECT notification_id AS id, notification_text AS message, 
  CASE WHEN dismissed = 1 THEN 'Alert' ELSE 'Reminder' END AS type 
  FROM user_notifications 
  WHERE user_account_id = ? 
  ORDER BY notification_id DESC`
);

function getUserNotifications(userID) {
	return getUserNotificationsStmt.all(userID);
}

exports.getUserNotifications = getUserNotifications;

// Default data for the database
if (dbSource.databaseJustCreated) {
	let userData = [
		{
			username: "john",
			password: "john",
			fullName: "John Doe",
			email: "john@example.com",
			address1: "123 Real Street",
			address2: "",
			city: "Houston",
			state: "TX",
			zipcode: 12345,
			skills: [
				"moving"
			],
			preferences: "No preferences",
			availability: new Date(2024, 0, 1),
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
			zipcode: 56789,
			skills: [
				"skill1",
				"moving",
			],
			preferences: "No preferences",
			availability: new Date(2024, 0, 2),
		},
	];
	
	userData.forEach(function(d) {
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
			addAvailabilityToUserID(account.user_account_id, Math.floor(d.availability.getTime() * 0.001));
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

	volunteerHistoryData.forEach(function(d) {
		db.prepare(`
			INSERT INTO volunteer_history (user_account_id, event_name, event_date, required_skills, urgency, location, status)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).run(d.user_account_id, d.event_name, d.event_date, d.required_skills, d.urgency, d.location, d.status);
	});

	let organizerData = [
		{
			username: "organizer",
			password: "organizer"
		}
	];
	
	organizerData.forEach(function(d) {
		createOrganizerAccount(d.username, d.password);
	});
}

exports.validateUserCredentials = validateOrganizerCredentials;
exports.validateOrganizerCredentials = validateOrganizerCredentials;