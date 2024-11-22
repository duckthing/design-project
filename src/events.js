const dbSource = require("./dbSource");
const db = dbSource.db;

class Event {
	constructor(name, date, urgent, skillsRequired, address, city, state) {
		this.name = name;
		this.date = date;
		this.urgent = urgent;
		this.skillsRequired = skillsRequired;
		this.address = address;
		this.city = city;
		this.state = state;
	}
}

const getAllEventsStmt = db.prepare(`
	SELECT * FROM events
`);
function getAllEvents() {
	return getAllEventsStmt.all();
}
exports.getAllEvents = getAllEvents;

const getFutureEventsStmt = db.prepare(`
	SELECT event_id, event_name, address, city, state_code, urgent, event_date, datetime(event_date, 'unixepoch') AS event_datetime FROM events WHERE event_date > unixepoch()
`);
function getFutureEvents() {
	return getFutureEventsStmt.all();
}
exports.getFutureEvents = getFutureEvents;

const getEventByEventIDStmt = db.prepare(`
	SELECT * FROM events WHERE event_id = ?
`);
function getEventByEventID(eventID) {
	return getEventByEventIDStmt.run(eventID);
}
exports.getEventByEventID = getEventByEventID;

const addRequiredSkillToEventIDStmt = db.prepare(`
	INSERT INTO event_requires_skills(event_id, skill_id) VALUES (?, ?)
`);
function addRequiredSkillToEventID(eventID, skillID) {
	addRequiredSkillToEventIDStmt.run(eventID, skillID);
}
exports.addRequiredSkillToEventID = addRequiredSkillToEventID;

const removeAllRequiredSkillsFromEventIDStmt = db.prepare(`
	DELETE FROM event_requires_skills WHERE event_id = ?
`);
function removeAllRequiredSkillsFromEventID(eventID) {
	removeAllRequiredSkillsFromEventIDStmt.run(eventID);
}
exports.removeAllRequiredSkillsFromEventID = removeAllRequiredSkillsFromEventID;

const createEventStmt = db.prepare(`
	INSERT INTO events(
		event_name, 
		address, 
		city, 
		state_code, 
		zipcode,
		urgent, 
		event_date, 
		description
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
function createEvent(eventName, address, city, stateCode, zipcode, urgent, eventDate, description, skillsRequired) {
	const urgentVal = urgent ? 1 : 0;
	let eventDateVal;
	if (typeof eventDate == "object") {
		eventDateVal = Math.floor(eventDate.getTime() * 0.001);
	} else {
		eventDateVal = eventDate;
	}

	const info = createEventStmt.run(
		eventName, 
		address, 
		city, 
		stateCode, 
		zipcode,    // Add zipcode
		urgentVal, 
		eventDateVal, 
		description
	);

	const eventID = info.lastInsertRowid;
	skillsRequired.forEach(function(skillID) {
		addRequiredSkillToEventID(eventID, skillID);
	});
	return getEventByEventID(eventID);
}
exports.createEvent = createEvent;

// TODO: Make it return only future events
const getAllVolunteerMatchesStmt2 = db.prepare(`
	SELECT
		v.user_account_id,
		v.full_name,
		e.event_id,
		e.event_name
	FROM
		user_accounts v,
		events e INNER JOIN event_rsvps r ON e.event_id = r.event_id
	WHERE
		r.rsvp_status = 'Interested' AND
		v.user_account_id = r.user_account_id AND
		e.event_date > unixepoch()
`);
function getAllVolunteerMatches() {
	const matches = getAllVolunteerMatchesStmt2.all();
	return matches;
}
exports.getAllVolunteerMatches = getAllVolunteerMatches;

function getEventsWithRSVPStatus(userId) {
    const stmt = db.prepare(`
        SELECT e.*, r.rsvp_status
        FROM events e
        LEFT JOIN event_rsvps r ON e.event_id = r.event_id AND r.user_account_id = ?
    `);
    return stmt.all(userId);
}
exports.getEventsWithRSVPStatus = getEventsWithRSVPStatus;


// Default data for the database
if (dbSource.databaseJustCreated) {
	let defaultEvents = [
		{
			eventName: "Beach Cleaning",
			address: "123 Beach Street",
			city: "Houston",
			stateCode: "TX",
			zipcode: 12345,
			urgent: false,
			eventDate: new Date(2024, 11, 29),
			description: "Help clean up the local beach!",
			skillsRequired: [1, 2]
		}
	];

	defaultEvents.forEach(function(e) {
		createEvent(e.eventName, e.address, e.city, e.stateCode, e.zipcode, e.urgent, e.eventDate, e.description, e.skillsRequired);
	});
}