const db = require('../../src/dbSource').db;
const accountsModule = require("../../src/accounts");
const path = require('path');

exports.get = function(req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }

	const account = accountsModule.getUserByUsername(req.session.user.username);
	if (!account) {
		// Handle case where account is not found
		return res.redirect("/login");
	}

    const highlightedEventId = req.query.highlight || null;
    
    // Query to get all events with event_id included
    const events = db.prepare(`
        SELECT DISTINCT e.event_id, e.event_name, e.event_date, e.address, e.city, e.state_code, e.zipcode, e.urgent, e.description 
        FROM
            events e
            LEFT JOIN event_rsvps r ON r.event_id = e.event_id
        WHERE
            r.user_account_id IS NULL AND
            e.event_date > unixepoch()
        ORDER BY e.event_date
    `).all();
    
    res.render(path.join(__dirname, '../../views/pages/user/events'), {
        events: events,
        highlightedEventId: highlightedEventId,
        session: req.session
    });
};
