const db = require("../../src/dbSource");
const accountsModule = require("../../src/accounts");
const eventsModule = require("../../src/events");

exports.get = function(req, res) {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}

	res.render("./pages/organizer/volunteer-matching-form", {
		matches: eventsModule.getAllVolunteerMatches(),
		session: req.session
	});
};
