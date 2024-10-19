const accountsModule = require("../src/accounts");
exports.get = function(req, res) {
	res.render("./pages/register.ejs", {});
}
exports.post = function(req, res) {
    // Check for missing required fields
	if (!req.body || !req.body.username || !req.body.password || !req.body.fullName || !req.body.address1 || !req.body.city || !req.body.state || !req.body.preferences || !req.body.availability) {
		res.send("Invalid data");
		return;
	}

    // Extract fields from request body
	const username = req.body.username;
	const password = req.body.password;
	const fullName = req.body.fullName;
	const address1 = req.body.address1;
	const address2 = req.body.address2 || ''; // optional field
	const city = req.body.city;
	const state = req.body.state;
	const skills = []; // Not provided, so initialize as an empty array
	const preferences = req.body.preferences;
	const availability = req.body.availability;

	let success ,account = accountsModule.createUserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability);
	req.session.user = {username: req.body.username};
	res.redirect("user/user-profile-management");
}