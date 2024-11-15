const events = require("../../src/events");
const skillsModule = require("../../src/skills");
const accountsModule = require("../../src/accounts");

exports.get = function(req, res) {
	// Check if the user is authenticated
	if (!req.session || !req.session.isAuthenticated) {
		return res.redirect("/login");
	}

	const allSkills = skillsModule.getAllSkills();
	res.render("./pages/organizer/event-creation-page.ejs", {
		allSkills: skillsModule.getAllSkills(),
		session: req.session,
		require: require
	});
}

exports.post = function(req, res) {
	// Ensure the user is authenticated
	if (!req.session || !req.session.isAuthenticated) {
		return res.status(401).send("Unauthorized");
	}

	if (req.body == null) {
		return res.status(400).send("Invalid data");
	}

	const eventName = req.body.eventName;
	const eventDate = new Date(req.body.eventDate);
	const urgent = req.body.urgent === "on" ? 1 : 0;
	const description = req.body.description;
	const skillsRequired = Array.isArray(req.body.skillRequired) ? req.body.skillRequired : [req.body.skillRequired];
	const address = req.body.address;
	const city = req.body.city;
	const stateCode = req.body.state;
	const zipcode = req.body.zipcode;

	try {
		const eventId = events.createEvent(eventName, address, city, stateCode, zipcode, urgent, eventDate, description, skillsRequired);

		// Render success page with redirect script
		res.render("pages/organizer/event-created-success", {
			eventName: eventName,
			redirectUrl: "/organizer/volunteer-matching-form" // Adjust the path if needed
		});
	} catch (error) {
		console.error("Error creating event or sending notifications:", error);
		res.status(500).send("Error creating event");
	}
};
