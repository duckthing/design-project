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

const getUserByUsernameStmt = db.prepare("SELECT * FROM user_accounts WHERE username = ?");
function getUserByUsername(username) {
	return getUserByUsernameStmt.get(username);
}
exports.getUserByUsername = getUserByUsername;

const getUserByUserIDStmt = db.prepare("SELECT * FROM user_accounts WHERE user_account_id = ?");
function getUserByUserID(username) {
	return getUserByUserIDStmt.get(username);
}

const getUserSkillsFromUserIDStmt = db.prepare("SELECT s.skill_id, s.skill_name FROM has_skills h INNER JOIN skills s ON h.skill_id = s.skill_id WHERE h.user_account_id = ?");
function getUserSkillsFromUserID(userID) {
	return getUserSkillsFromUserIDStmt.all(userID);
}
exports.getUserSkillsFromUserID = getUserSkillsFromUserID;

const getUserAvailabilityFromUserIDStmt = db.prepare("SELECT a.from_date, a.to_date FROM user_available_at a");
function getUserAvailabilityFromUserID(userID) {
	return getUserAvailabilityFromUserIDStmt.all(userID);
}
exports.getUserAvailabilityFromUserID = getUserAvailabilityFromUserID;

const createUserAccountStmt = db.prepare("INSERT INTO user_accounts(username, password, full_name, address1, city, state_code, zipcode, preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
function createUserAccount(username, password, fullName, address1 = "", city = "", stateCode = "TX", zipcode = 0, preferences = "") {
	// TODO: Validate input
	const existingAccount = getUserByUsername(username);
	if (existingAccount) {
		// This account already exists
		return false, "Account already exists";
	} else {
		// Create the account
		const info = createUserAccountStmt.run(username, password, fullName, address1, city, stateCode, zipcode, preferences);
		return true, getUserByUserID(info.lastInsertRowid);
	}
}

function validateUserCredentials(username, password) {
	const account = getUserAccount(username);
	if (account && account.password === password) {
		return true;
	}
	return false;
}

const getOrganizerByUsernameStmt = db.prepare("SELECT * FROM organizer_accounts WHERE username = ?");
function getOrganizerByUsername(username) {
	return getOrganizerByUsernameStmt.get(username);
}
exports.getOrganizerByUsername = getOrganizerByUsername;

const getOrganizerByUserIDStmt = db.prepare("SELECT * FROM organizer_accounts WHERE organizer_account_id = ?");
function getOrganizerByUserID(userID) {
	return getOrganizerByUserIDStmt.get(userID);
}
exports.getOrganizerByUsername = getOrganizerByUsername;


const createOrganizerAccountStmt = db.prepare("INSERT INTO organizer_accounts(username, password) VALUES (?,?)")
function createOrganizerAccount(username, password) {
	// TODO: Validate input
	const account = getOrganizerByUsername(username);
	if (account) {
		return false, "Account already exists";
	} else {
		// Create the account
		const info = createOrganizerAccountStmt.run(username, password);
		return true, getOrganizerByUserID(info.lastInsertRowid);
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

// Default data for the database
if (db.databaseJustCreated) {
	let userData = [
		{
			username: "john",
			password: "john",
			fullName: "John Doe",
			address1: "123 Real Street",
			address2: "",
			city: "Houston",
			state: "TX",
			skills: [
				"moving"
			],
			preferences: "No preferences",
			availability: new Date(2024, 1, 1),
		},
		{
			username: "user",
			password: "user",
			fullName: "User User",
			address1: "123 Also Real Street",
			address2: "",
			city: "Houston",
			state: "TX",
			skills: [
				"skill1",
				"moving",
			],
			preferences: "No preferences",
			availability: new Date(2024, 1, 2),
		},
	];
	
	userData.forEach(function(d) {
		createUserAccount(d.username, d.password, d.fullName, d.address1, d.address2, d.city, d.state, d.skills, d.preferences, d.availability);
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