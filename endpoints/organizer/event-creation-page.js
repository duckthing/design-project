const events = require("../../src/events");

exports.get = function(req, res) {
	res.render("./pages/organizer/event-creation-page.ejs", {});
}

exports.post = function(req, res) {
	if (req.body == null) {
		res.send("Invalid data");
		return;
	}

	const name = req.body.name;
	const date = req.body.date;
	const urgent = req.body.urgent;
	const address = req.body.address;
	const city = req.body.city;
	const state = req.body.state;

	const event = events.getEvent(req.body.name);
	if (event != null) {
		// Duplicate event
		res.send("Duplicate event");
		return
	}

	events.createEvent(name, date, urgent, address, city, state);
	res.send("Created event");
}