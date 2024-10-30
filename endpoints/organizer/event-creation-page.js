const events = require("../../src/events");
const skillsModule = require("../../data/skills");

exports.get = function(req, res) {
	const allSkills = skillsModule.getAllSkills();
	res.render("./pages/organizer/event-creation-page.ejs", {
		allSkills: skillsModule.getAllSkills(),
		require: require
	});
}

exports.post = function(req, res) {
	if (req.body == null) {
		res.send("Invalid data");
		return;
	}

	const eventName = req.body.eventName;
	const eventDate = new Date(req.body.eventDate);
	const urgent = req.body.urgent;
	const skillsRequired = [req.body.skillRequired];
	const address = req.body.address;
	const city = req.body.city;
	const stateCode = req.body.state;

	events.createEvent(eventName, address, city, stateCode, urgent, eventDate, skillsRequired);
	res.send("Created event");
}