const events = require("../../src/events");

exports.get = function(req, res) {
	res.render("./pages/organizer/event-creation-page.ejs", {require: require});
}

exports.post = function(req, res) {
	if (req.body == null) {
		res.send("Invalid data");
		return;
	}

	const name = req.body.eventName;
	const date = new Date(req.body.eventDate);
	const urgent = req.body.urgent;
	const address = req.body.address;
	const city = req.body.city;
	const state = req.body.state;
	const skillRequired = [req.body.skillRequired]

	const event = events.getEvent(req.body.name);
	if (event != null) {
		// Duplicate event
		res.send("Duplicate event");
		return
	}

	events.createEvent(name, date, urgent, skillRequired, address, city, state);
	res.send("Created event");
}