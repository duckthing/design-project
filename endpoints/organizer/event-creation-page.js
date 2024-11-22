const events = require("../../src/events");
const skillsModule = require("../../src/skills");
const accountsModule = require("../../src/accounts");
const emailService = require('../../src/emailService');
const db = require("../../src/dbSource").db;

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

exports.post = async function(req, res) {
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
	const skills = req.body.skills != null && Array.isArray(req.body.skills) ? req.body.skills : [];
	const address = req.body.address;
	const city = req.body.city;
	const stateCode = req.body.state;
	const zipcode = req.body.zipcode;

	try {
		// Create the event first
		console.log('Creating event in database...');
		const eventId = events.createEvent(eventName, address, city, stateCode, zipcode, urgent, eventDate, description, skills);
		console.log('Event created successfully with ID:', eventId);
	
		// Send emails after successful creation
		console.log('Fetching users with emails...');
		const users = db.prepare(`
			SELECT email 
			FROM user_accounts 
			WHERE email IS NOT NULL AND email != ''
		`).all();
	
		if (users.length > 0) {
			console.log('Sending emails to users...');
			for (const user of users) {
				try {
					await emailService.sendEventNotification(user.email, {
						eventName,
						eventDate,
						city,
						stateCode
					});
					console.log(`Email sent successfully to ${user.email}`);
				} catch (emailError) {
					console.error('Error sending email to', user.email, emailError);
				}
			}
		} else {
			console.log('No users with email addresses found.');
		}
	
		res.render("pages/organizer/event-created-success", {
			eventName,
			redirectUrl: "/organizer/volunteer-matching-form",
		});
	} catch (error) {
		console.error("Error creating event or sending notifications:", error);
		res.status(500).send("Error creating event");
	}	
};
