class UserAccount {
	constructor(username, password, address1, address2, city, state, skills, preferences, availability) {
		this.username = username;
		this.password = password;
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
let userAccounts = {}

function createUserAccount(username, password, address1, address2, city, state, skills, preferences, availability) {
	// TODO: Validate input
	const account = UserAccount(username, password, address1, address2, city, state, skills, preferences, availability);
	if (userAccounts[username] == null) {
		userAccounts[username] = account;
		return true, account
	} else {
		return false, "Account already exists"
	}
}

function getUserAccount(username) {
	return userAccounts[username];
}

exports.createUserAccount = createUserAccount;
exports.getUserAccount = getUserAccount;