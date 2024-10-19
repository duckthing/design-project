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

let events = []
let eventsMap = {}

function createEvent(name, date, urgent, skillsRequired, address, city, state) {
	const event = new Event(name, date, urgent, skillsRequired, address, city, state);
	events.push(event);
	eventsMap[name] = event;
}

function getEvent(name) {
	return eventsMap[name];
}

exports.events = events;
exports.createEvent = createEvent;
exports.getEvent = getEvent;