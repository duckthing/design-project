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
let userAccounts = {}

function createUserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability) {
	// TODO: Validate input
	const account = new UserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability);
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

let data = [
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
		availability: "01/02/2024",
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
		availability: "01/02/2024",
	},
];

data.forEach(function(d) {
	createUserAccount(d.username, d.password, d.fullName, d.address1, d.address2, d.city, d.state, d.skills, d.preferences, d.availability);
});

exports.createUserAccount = createUserAccount;
exports.getUserAccount = getUserAccount;