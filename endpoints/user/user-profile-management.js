const accountsModule = require("../../src/accounts");
const skillsModule = require("../../src/skills");
const statesModule = require("../../src/states");

exports.get = function(req, res) {
	if (req.session.user) {
		const account = accountsModule.getUserByUsername(req.session.user.username);
		if (!account) {
			// Handle case where account is not found
			return res.redirect("/login");
		}
		const userSkills = accountsModule.getUserSkillsFromUserID(account.user_account_id);
		const userAvailability = accountsModule.getUserAvailabilityFromUserID(account.user_account_id);
		const allSkills = skillsModule.getAllSkills();
		const states = statesModule.states;
		let date;
		if (userAvailability[0] == null) {
			date = new Date();
		} else {
			date = new Date();
			date.setTime(userAvailability[0].available_at * 1000);
		}

		return res.render("pages/user/user-profile-management", {
			profile: account,
			userSkills: userSkills,
			userAvailability: date.toISOString().substring(0, 10),
			allSkills: allSkills,
			allStates: states,
			session: req.session,
			require: require,
		});
	} else {
		return res.redirect("/login");
	}
};

exports.post = function(req, res) {
	if (req.session.user == null) return res.redirect("/login");
	const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;
	
	// Basic validation for required fields
	if (!fullName || !address1 || !city || !state || !availability) {
		return res.status(400).send("Please fill all required fields.");
	}

	const account = accountsModule.getUserByUsername(req.session.user.username);
	if (!account) {
		// Account doesn't exist
		return res.status(400).send("Account does not exist.");
	} else {
		// Update the account and redirect back when done
		accountsModule.updateUserAccountProfile(account.user_account_id, account.username, account.password, fullName, address1, address2, city, state, zipcode, preferences, skills.length > 0 ? skills.split(",") : [], [new Date(availability)]);
		return res.redirect("/user/user-profile-management");
	}
};
