const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const PDFDocument = require("pdfkit"); // Import PDFKit
const db = require("../../src/dbSource").db;

exports.get = function (req, res) {
	// if (!req.session.isAuthenticated) {
	// 	return res.redirect('/login');
	// }

	res.render("./pages/organizer/reports", {
		session: req.session,
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
	return stmtGetParticipation.all();
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
		r.event_id = e.event_id
`);
function getAssignmentRecords() {
	return stmtGetAssignments.all();
}

exports.post = function (req, res) {
	// Ensure the temp directory exists
	const tempDir = path.join(__dirname, "../../temp");
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir, { recursive: true });
	}

	const { reportType, reportFormat } = req.body;
	const fileExtension = reportFormat === "csv" ? ".csv" : ".pdf";
	const filePath = path.join(tempDir, "data-" + Date.now() + fileExtension);

	if (reportFormat === "csv") {
		// CSV Generation
		if (reportType === "participationHistory") {
			const csvWriter = createCsvWriter({
				path: filePath,
				header: [
					{ id: "user_account_id", title: "Volunteer ID" },
					{ id: "event_id", title: "Event ID" },
					{ id: "full_name", title: "Volunteer Name" },
					{ id: "event_name", title: "Event" },
				],
			});
			csvWriter.writeRecords(getParticipationRecords()).then(() => {
				res.download(filePath);
			});
		} else if (reportType === "eventAssignments") {
			const csvWriter = createCsvWriter({
				path: filePath,
				header: [
					{ id: "user_account_id", title: "Volunteer ID" },
					{ id: "event_id", title: "Event ID" },
					{ id: "full_name", title: "Volunteer Name" },
					{ id: "event_name", title: "Event" },
					{ id: "rsvp_status", title: "RSVP Status" },
				],
			});
			csvWriter.writeRecords(getAssignmentRecords()).then(() => {
				res.download(filePath);
			});
		} else {
			res.send("Invalid report type");
		}
	} else if (reportFormat === "pdf") {
		// PDF Generation
		const doc = new PDFDocument();
		const writeStream = fs.createWriteStream(filePath);
		doc.pipe(writeStream);

		// Add PDF content based on report type
		if (reportType === "participationHistory") {
			const records = getParticipationRecords();
			doc.fontSize(16).text("Participation History Report", { align: "center" });
			doc.moveDown();
			records.forEach((record) => {
				doc
					.fontSize(12)
					.text(
						`Volunteer ID: ${record.user_account_id}, Event ID: ${record.event_id}, Volunteer Name: ${record.full_name}, Event: ${record.event_name}`
					);
				doc.moveDown();
			});
		} else if (reportType === "eventAssignments") {
			const records = getAssignmentRecords();
			doc.fontSize(16).text("Event Assignments Report", { align: "center" });
			doc.moveDown();
			records.forEach((record) => {
				doc
					.fontSize(12)
					.text(
						`Volunteer ID: ${record.user_account_id}, Event ID: ${record.event_id}, Volunteer Name: ${record.full_name}, Event: ${record.event_name}, RSVP Status: ${record.rsvp_status}`
					);
				doc.moveDown();
			});
		} else {
			res.send("Invalid report type");
			return;
		}

		doc.end();

		writeStream.on("finish", () => {
			res.download(filePath, (err) => {
				if (!err) fs.unlinkSync(filePath); // Clean up file after download
			});
		});
	} else {
		res.status(400).send("Invalid report format");
	}
};
