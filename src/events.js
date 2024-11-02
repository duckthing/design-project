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
	INSERT INTO events(event_name, address, city, state_code, urgent, event_date) VALUES (?, ?, ?, ?, ?, ?)
`);
function createEvent(eventName, address, city, stateCode, urgent, eventDate, skillsRequired) {
	// Convert things into SQL values
	const urgentVal = urgent ? 1 : 0;
	let eventDateVal;
	if (typeof eventDate == "object") {
		// (most likely a Date object)
		// Divide by 1000 to get seconds, not milliseconds
		eventDateVal = Math.floor(eventDate.getTime() * 0.001);
	} else {
		eventDateVal = eventDate;
	}
	const info = createEventStmt.run(eventName, address, city, stateCode, urgentVal, eventDateVal);
	const eventID = info.lastInsertRowId;
	skillsRequired.forEach(function(skillID) {
		addRequiredSkillToEventID(eventID, skillID);
	});
	return getEventByEventID(eventID);
}
exports.createEvent = createEvent;

const getAllVolunteerMatchesStmt = db.prepare(`
	SELECT DISTINCT v.full_name, e.event_id, e.event_name
	FROM user_accounts v, user_available_at a, events e
	WHERE
		v.user_account_id = a.user_account_id
		AND
		date(a.available_at, 'unixepoch') = date(e.event_date, 'unixepoch')
	ORDER BY
		e.event_id
`);
function getAllVolunteerMatches() {
	const matches = getAllVolunteerMatchesStmt.all();
	return matches;
}
exports.getAllVolunteerMatches = getAllVolunteerMatches;


// Default data for the database
if (dbSource.databaseJustCreated) {
	let defaultEvents = [
		{
			eventName: "Beach Cleaning",
			address: "123 Beach Street",
			city: "Houston",
			stateCode: "TX",
			urgent: false,
			eventDate: new Date(2024, 0, 1),
			skillsRequired: [1, 2]
		}
	];

	defaultEvents.forEach(function(e) {
		createEvent(e.eventName, e.address, e.city, e.stateCode, e.urgent, e.eventDate, e.skillsRequired);
	});
}