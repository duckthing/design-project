const accountsModule = require("../src/accounts");
const bodyParser = require('body-parser');

exports.get = function (req, res) {
	res.render("./pages/login.ejs", {});
};

exports.post = function (req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		res.status(400).send("Invalid data");
		return;
	}

	const userAccount = accountsModule.getUserAccount(req.body.username);
	const organizerAccount = accountsModule.getOrganizerAccount(req.body.username);
	if (userAccount) {
		// User account exists
		if (userAccount.password !== req.body.password) {
			// Incorrect password
			res.status(401).send("Invalid password");
			return;
		} else {
			// Correct password
			req.session.user = { username: req.body.username };
			res.redirect("/user/user-profile-management");
		}
	} else if (organizerAccount) {
		// Organizer account exists
		if (organizerAccount.password !== req.body.password) {
			// Incorrect password
			res.status(401).send("Invalid password");
			return;
		} else {
			// Correct password
			req.session.organizer = { username: req.body.username };
			res.redirect("/organizer/event-creation-page");
		}
	} else {
		// No account found
		res.status(401).send("Invalid username");
		return;
	}
}
