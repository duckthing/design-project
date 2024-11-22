const path = require('path');
const accountsModule = require("../../src/accounts");
const db = require("../../src/dbSource").db;

exports.get = function (req, res) {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}

	if (!req.session.user) {
		return res.redirect("/login");
	}

	const userId = req.session.user.user_account_id;
	const historyData = db.prepare(`
		SELECT
			e.event_name,
			e.event_date,
			e.address || ', ' || e.city || ', ' || e.state_code || ', ' AS location,
			e.urgent,
			e.event_date,
			r.rsvp_status
		FROM
			user_accounts v,
			events e,
			event_rsvps r
		WHERE
			v.user_account_id = ? AND
			r.user_account_id = v.user_account_id AND
			r.event_id = e.event_id AND
			r.rsvp_status != 'NotInterested'
		ORDER BY
			e.event_date DESC
	`).all(userId);
	console.log(historyData);

	res.render(path.join(__dirname, '../../views/pages/organizer/volunteer-history.ejs'), {
		events: historyData,
		session: req.session
	});

};
