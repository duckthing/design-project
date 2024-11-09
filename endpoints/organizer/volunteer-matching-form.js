const accountsModule = require("../../src/accounts");
const eventsModule = require("../../src/events");

function getMatches() {
	let matches = [];
	for (const event of eventsModule.events) {
		event:
		for (const user of accountsModule.users) {
			for (const skillID of event.skillsRequired) {
				if (user.skills.includes(skillID)) {
					matches.push({
						user: user,
						event: event,
					});
					break event;
				}
			}
		}
	}
	return matches;
}

exports.get = function(req, res) {
	if (!req.session.isAuthenticated) {
			return res.redirect('/login');
	}

	res.render("./pages/organizer/volunteer-matching-form", {
			matches: eventsModule.getAllVolunteerMatches(),
			session: req.session
	});
};
