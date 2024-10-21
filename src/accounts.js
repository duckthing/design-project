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

// userAccounts[username] = UserAccount
let users = [];
let userAccounts = {};

function createUserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability) {
	// TODO: Validate input
	const account = new UserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability);
	if (userAccounts[username] == null) {
		users.push(account);
		userAccounts[username] = account;
		return true, account
	} else {
		return false, "Account already exists"
	}
}

function getUserAccount(username) {
	return userAccounts[username];
}

function validateUserCredentials(username, password) {
	const account = getUserAccount(username);
	if (account && account.password === password) {
		return true;
	}
	return false;
}

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

class OrganizerAccount {
	constructor(username, password) {
		this.username = username;
		this.password = password;
	}
}

let organizers = [];
let organizerMap = {};

function createOrganizerAccount(username, password) {
	// TODO: Validate input
	const account = new OrganizerAccount(username, password);
	if (organizerMap[username] == null) {
		organizerMap[username] = account;
		organizers.push(account);
		return true, account
	} else {
		return false, "Account already exists"
	}
}

function getOrganizerAccount(username) {
	return organizerMap[username];
}

function validateOrganizerCredentials(username, password) {
	const account = getOrganizerAccount(username);
	if (account && account.password === password) {
		return true;
	}
	return false;
}

let organizerData = [
	{
		username: "organizer",
		password: "organizer"
	}
];

organizerData.forEach(function(d) {
	createOrganizerAccount(d.username, d.password);
});

exports.users = users;
exports.createUserAccount = createUserAccount;
exports.getUserAccount = getUserAccount;
exports.organizers = organizers;
exports.createOrganizerAccount = createOrganizerAccount;
exports.getOrganizerAccount = getOrganizerAccount;
exports.validateUserCredentials = validateOrganizerCredentials;
exports.validateOrganizerCredentials = validateOrganizerCredentials;