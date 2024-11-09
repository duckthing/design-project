const db = require("../../src/dbSource").db;

// RSVP for an event
exports.post = function (req, res) {
    // Ensure the user is logged in
    if (!req.session.isAuthenticated) {
        return res.status(401).send("Unauthorized");
    }

    /* console.log("Request body:", req.body); */

    const { eventId, status } = req.body;
    const userId = req.session.user.user_account_id;

    // Validate the RSVP data
    if (!eventId || !status || !['Going', 'Interested'].includes(status)) {
        return res.status(400).send("Invalid RSVP data");
    }

    try {
      // Insert or update RSVP data with conflict handling
      const rsvpStmt = db.prepare(`
          INSERT INTO event_rsvps (event_id, user_account_id, rsvp_status)
          VALUES (?, ?, ?)
          ON CONFLICT(event_id, user_account_id) DO UPDATE SET rsvp_status = excluded.rsvp_status
      `);
      rsvpStmt.run(eventId, userId, status);

      res.send("RSVP successfully updated");
  } catch (error) {
      console.error("Error handling RSVP:", error);
      res.status(500).send("Internal Server Error while processing RSVP");
  }
};