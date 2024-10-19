const accountsModule = require("../../src/accounts")

exports.get = function(req, res) {
	if (req.session.user) {
		const account = accountsModule.getUserAccount(req.session.user.username);
		res.render("./pages/user/user-profile-management.ejs", {
			user: account,
			require: require
		});
	} else {
		res.redirect("/login");
	}
}