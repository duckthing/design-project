const db = require("../../src/dbSource").db;

// RSVP for an event
exports.post = function (req, res) {
	// Ensure the user is logged in
	if (!req.session.isAuthenticated || req.session.organizer == null) {
		return res.status(401).send("Unauthorized");
	}

	/* console.log("Request body:", req.body); */

	const { userAccountId, eventId, status } = req.body;

	// Validate the RSVP data
	if (!eventId || !status || !['Confirmed', 'Rejected'].includes(status)) {
		return res.status(400).send("Invalid RSVP data");
	}

	try {
		// Insert or update RSVP data with conflict handling
		const rsvpStmt = db.prepare(`
			UPDATE
				event_rsvps
			SET
				rsvp_status = ?
			WHERE
				user_account_id = ? AND
				event_id = ?
		`);
		rsvpStmt.run(status, userAccountId, eventId);

		res.send("RSVP successfully updated");
	} catch (error) {
		console.error("Error handling RSVP:", error);
		res.status(500).send("Internal Server Error while processing RSVP");
	}
};