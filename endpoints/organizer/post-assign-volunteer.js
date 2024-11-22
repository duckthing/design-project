const db = require("../../src/dbSource").db;

// RSVP for an event
exports.post = function (req, res) {
    // Ensure the user is logged in as an organizer
    if (!req.session.isAuthenticated || req.session.organizer == null) {
        return res.status(401).send("Unauthorized");
    }

    const { userAccountId, eventId, status } = req.body;

    // Validate the RSVP data
    if (!eventId || !status || !['Confirmed', 'Rejected'].includes(status)) {
        return res.status(400).send("Invalid RSVP data");
    }

    try {
        // Update RSVP status
        const rsvpStmt = db.prepare(`
            UPDATE event_rsvps
            SET rsvp_status = ?
            WHERE user_account_id = ? AND event_id = ?
        `);
        rsvpStmt.run(status, userAccountId, eventId);

        // Handle 'Confirmed' status: Add to volunteer_history and send notification
        if (status === 'Confirmed') {
            const eventDetails = db.prepare(`
                SELECT e.event_name, e.event_date, e.address AS location, 
                       CASE WHEN e.urgent = 1 THEN 'High' ELSE 'Low' END AS urgency
                FROM events e
                WHERE e.event_id = ?
            `).get(eventId);

            if (eventDetails) {
                // Use INSERT OR REPLACE to update existing records
                const insertHistoryStmt = db.prepare(`
                    INSERT OR REPLACE INTO volunteer_history 
                    (user_account_id, event_id, event_name, event_date, location, urgency, required_skills, status)
                    VALUES (?, ?, ?, ?, ?, ?, 'General', 'Upcoming')
                `);
                insertHistoryStmt.run(
                    userAccountId,
                    eventId,
                    eventDetails.event_name,
                    new Date(eventDetails.event_date * 1000).toISOString().split("T")[0],
                    eventDetails.location,
                    eventDetails.urgency
                );

                // Add a notification for the user
                const notificationStmt = db.prepare(`
                    INSERT INTO user_notifications (user_account_id, notification_text)
                    VALUES (?, ?)
                `);
                notificationStmt.run(
                    userAccountId,
                    `Your RSVP for the event "${eventDetails.event_name}" on ${new Date(eventDetails.event_date * 1000).toLocaleDateString()} has been accepted.`
                );
            }
        }

        // Handle 'Rejected' status: Remove from volunteer_history and notify the user
        if (status === 'Rejected') {
            const deleteHistoryStmt = db.prepare(`
                DELETE FROM volunteer_history
                WHERE user_account_id = ? AND event_id = ?
            `);
            deleteHistoryStmt.run(userAccountId, eventId);

            // Add a notification for the user
            const notificationStmt = db.prepare(`
                INSERT INTO user_notifications (user_account_id, notification_text)
                VALUES (?, ?)
            `);
            notificationStmt.run(
                userAccountId,
                `Your RSVP for the event with ID ${eventId} has been rejected.`
            );
        }

        res.send("RSVP and volunteer history successfully updated");
    } catch (error) {
        console.error("Error handling RSVP:", error);
        res.status(500).send("Internal Server Error while processing RSVP");
    }
};
