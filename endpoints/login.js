const accountsModule = require("../src/accounts");
const bodyParser = require('body-parser');

exports.get = function (req, res) {
	res.render("./pages/login.ejs", { session: req.session });
};

exports.post = function (req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		return res.status(400).send("Invalid data");
	}

	const userAccount = accountsModule.getUserAccount(req.body.username);
	const organizerAccount = accountsModule.getOrganizerAccount(req.body.username);

	if (userAccount) {
		// User account exists
		if (userAccount.password !== req.body.password) {
			// Incorrect password
			return res.status(401).send("Invalid password");
		} else {
			// Correct password
			req.session.user = { username: req.body.username, role: 'user' };
			req.session.isAuthenticated = true;
			return res.redirect("/user/user-profile-management");
		}
	} else if (organizerAccount) {
		// Organizer account exists
		if (organizerAccount.password !== req.body.password) {
			// Incorrect password
			return res.status(401).send("Invalid password");
		} else {
			// Correct password
			req.session.organizer = { username: req.body.username, role: 'organizer' };
			req.session.isAuthenticated = true;
			return res.redirect("/organizer/event-creation-page");
		}
	} else {
		// No account found
		res.render('pages/login', { session: req.session, error: 'Invalid username or password' });
		return res.status(401).send("Invalid username");
	}
};

exports.logout = function (req, res) {
	req.session.destroy((err) => {
		if (err) {
			console.error('Error logging out:', err);
			return res.status(500).send("Error logging out.");
		}
		return res.redirect("/login"); // Redirect users to login after logout
	})
}