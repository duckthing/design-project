const accountsModule = require("../src/accounts");
exports.get = function(req, res) {
	res.render("./pages/register.ejs", {});
}
exports.post = function(req, res) {
    // Check for missing required fields
	if (!req.body || !req.body.username || !req.body.password || !req.body.role) {
		res.send("Invalid data");
		return;
	}

    // Extract fields from request body
	const username = req.body.username;
	const password = req.body.password;

	console.log(req.body.role)
	if (req.body.role == "volunteer") {
		const fullName = req.body.fullName;
		const address1 = req.body.address1;
		const address2 = req.body.address2 || ''; // optional field
		const city = req.body.city;
		const state = req.body.state;
		const skills = []; // Not provided, so initialize as an empty array
		const preferences = req.body.preferences;
		const availability = new Date();

		let success = accountsModule.createUserAccount(username, password, fullName, "", "", "TX", 0, "");
		if (success) {
			req.session.user = {username: req.body.username};
			res.redirect("user/user-profile-management");
		} else {
			// Account is also the error message
			res.send("Could not create volunteer account: Account already exists");
		}
		return;
	} else if (req.body.role == "admin") {
		console.log("creating admin account")
		let success = accountsModule.createOrganizerAccount(username, password);
		if (success) {
			req.session.organizer = {username: req.body.username};
			res.redirect("organizer/event-creation-page");
		} else {
			res.send("Could not create organizer account: Account already exists");
		}
		return;
	} else {
		res.send("Invalid data");
		return;
	}
}