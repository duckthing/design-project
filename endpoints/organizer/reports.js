const db = require("../../src/dbSource");

exports.get = function(req, res) {
	// if (!req.session.isAuthenticated) {
	// 	return res.redirect('/login');
	// }

	res.render("./pages/organizer/reports", {
		session: req.session
	});
};

exports.post = function(req, res) {
	res.render("./pages/organizer/reports", {
		session: req.session
	});
}