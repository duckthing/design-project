const path = require('path');
const accountsModule = require("../../src/accounts");
const db = require("../../src/dbSource").db;

function validateEvent(event) {
  const requiredFields = ['eventName', 'date', 'requiredSkills', 'urgency', 'location', 'status'];

  for (const field of requiredFields) {
    if (!event[field]) {
      return `Missing required field: ${field}`;
    }
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(event.date)) {
    return `Invalid date format for event "${event.eventName}": ${event.date}`;
  }

  const validUrgencies = ['High', 'Medium', 'Low'];
  if (!validUrgencies.includes(event.urgency)) {
    return `Invalid urgency value for event "${event.eventName}": ${event.urgency}`;
  }

  const validStatuses = ['Completed', 'In Progress', 'Not Started', 'Upcoming'];
  if (!validStatuses.includes(event.status)) {
    return `Invalid status value for event "${event.eventName}": ${event.status}`;
  }

  return null;
}

exports.get = function(req, res) {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userId = req.session.user.user_account_id;
  const historyData = db.prepare(`
    SELECT event_name AS eventName, event_date AS date, required_skills AS requiredSkills, urgency, location, status 
    FROM volunteer_history
    WHERE user_account_id = ?
  `).all(userId);

	const errors = [];
  historyData.forEach((event, index) => {
    const validationError = validateEvent(event);
    if (validationError) {
      errors.push(`Event #${index + 1}: ${validationError}`);
    }
  });

  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    return res.status(400).send('Error validating event data: ' + errors.join(', '));
  }

  res.render(path.join(__dirname, '../../views/pages/organizer/volunteer-history.ejs'), {
		events: historyData,
		session: req.session
	});

};
