const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const db = require("../../src/dbSource").db;

exports.get = function(req, res) {
	// if (!req.session.isAuthenticated) {
	// 	return res.redirect('/login');
	// }

	res.render("./pages/organizer/reports", {
		session: req.session
	});
};

const stmtGetParticipation = db.prepare(`
	SELECT
		v.user_account_id,
		e.event_id,
		v.full_name,
		e.event_name
	FROM
		user_accounts v,
		events e,
		event_rsvps r
	WHERE
		v.user_account_id = r.user_account_id AND
		r.event_id = e.event_id AND
		r.rsvp_status = 'Confirmed'
`);
function getParticipationRecords() {
	const results = stmtGetParticipation.all()
	return results
}

const stmtGetAssignments = db.prepare(`
	SELECT
		v.user_account_id,
		e.event_id,
		v.full_name,
		e.event_name,
		r.rsvp_status
	FROM
		user_accounts v,
		events e,
		event_rsvps r
	WHERE
		v.user_account_id = r.user_account_id AND
		r.event_id = e.event_id AND
		r.rsvp_status = 'Confirmed'
`);
function getAssignmentRecords() {
	const results = stmtGetAssignments.all()
	return results
}

exports.post = function(req, res) {
	// if (!req.session.isAuthenticated) {
	// 	return res.redirect('/login');
	// }

	const { fromDate, toDate, reportType, reportFormat } = req.body;
	const fileExtension = reportFormat == "csv" ? ".csv" : ".pdf"
	const filePath = "./temp/data-" + (new Date()).getTime() + fileExtension;


	if (reportType == "participationHistory") {
		// File with all the events the volunteer was confirmed to go to
		const csvWriter = createCsvWriter({
			path: filePath,
			header: [
				{id: "user_account_id", title: "Volunteer ID"},
				{id: "event_id", title: "Event ID"},
				{id: "full_name", title: "Volunteer Name"},
				{id: "event_name", title: "Event"}
			]
		});
		csvWriter.writeRecords(getParticipationRecords()).then(() => {
			res.download(filePath);
		});
	} else if (reportType == "eventAssignments") {
		// File with the assigment statuses of 
		const csvWriter = createCsvWriter({
			path: filePath,
			header: [
				{id: "user_account_id", title: "Volunteer ID"},
				{id: "event_id", title: "Event ID"},
				{id: "full_name", title: "Volunteer Name"},
				{id: "event_name", title: "Event"},
				{id: "rsvp_status", title: "RSVP Status"}
			]
		});

		csvWriter.writeRecords(getAssignmentRecords()).then(() => {
			res.download(filePath);
		});
	} else {
		res.send("Invalid report type");
		return
	}
}