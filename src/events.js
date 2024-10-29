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

const getAllEventsStmt = db.prepare("SELECT * FROM events");
function getAllEvents() {
	return getAllEventsStmt.all();
}
exports.getAllEvents = getAllEvents;

const getFutureEventsStmt = db.prepare("SELECT event_id, event_name, address, city, state_code, urgent, event_date, datetime(event_date, 'unixepoch') AS event_datetime FROM events WHERE event_date > unixepoch()")
function getFutureEvents() {
	return getFutureEventsStmt.all();
}
exports.getFutureEvents = getFutureEvents;

const createEventStmt = db.prepare("INSERT INTO events(event_name, address, city, state_code, urgent, event_date) VALUES (?, ?, ?, ?, ?, ?)");
function createEvent(eventName, address, city, stateCode, urgent, eventDate) {
	// Convert things into SQL values
	const urgentVal = urgent ? 1 : 0;
	let eventDateVal;
	if (typeof eventDate == "object") {
		// (most likely a Date object)
		// Divide by 1000 to get seconds, not milliseconds
		eventDateVal = eventDate.getTime() * 0.001;
	} else {
		eventDateVal = eventDate;
	}
	const info = createEventStmt.run(eventName, address, city, stateCode, urgentVal, eventDateVal);
	return info;
}
exports.createEvent = createEvent;