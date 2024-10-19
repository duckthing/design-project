const accountsModule = require("../src/accounts");
exports.get = function(req, res) {
	res.render("./pages/register.ejs", {});
}
exports.post = function(req, res) {
	if (req.body == null || req.body.role == null || req.body.fullname == null || req.body.email == null || req.body.email == null) {
		res.send("Invalid data");
		return;
	}
	const username = req.body.username;
	const password = req.body.password;
	const fullName = req.body.fullName;
	const address1 = req.body.address1;
	const address2 = req.body.address2;
	const city = req.body.city;
	const state = req.body.state;
	const skills = [];
	const preferences = req.body.preferences;
	const availability = req.body.availability;

	let success ,account = accountsModule.createUserAccount(username, password, fullName, address1, address2, city, state, skills, preferences, availability);
	req.session.user = {username: req.body.username};
	res.redirect("user/user-profile-management");
}