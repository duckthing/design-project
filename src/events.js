class Event {
	constructor(name, date, urgent, address, city, state) {
		this.name = name;
		this.date = date;
		this.urgent = urgent;
		this.address = address;
		this.city = city;
		this.state = state;
	}
}

let events = []
let eventsMap = {}

function createEvent(name, date, urgent, address, city, state) {
	const event = new Event(name, date, urgent, address, city, state);
	events.push(event);
	eventsMap[name] = event;
}

function getEvent(name) {
	return eventsMap[name];
}

exports.createEvent = createEvent;
exports.getEvent = getEvent;