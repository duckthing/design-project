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
  // Fetch data dynamically (this could be from a database or any other source)
  /* const historyData = [
    {
      eventName: 'Beach Cleanup',
      date: '2024-10-01',
      requiredSkills: 'Teamwork, Environmental Awareness',
      urgency: 'High',
      location: 'Santa Monica Beach',
      status: 'Completed',
    },
    {
      eventName: 'Community Garden',
      date: '2024-09-20',
      requiredSkills: 'Gardening, Communication',
      urgency: 'Medium',
      location: 'Central Park',
      status: 'In Progress',
    },
    {
      eventName: 'Tree Planting',
      date: '2024-11-15',
      requiredSkills: 'Environmental Awareness, Physical Stamina',
      urgency: 'Low',
      location: 'Golden Gate Park',
      status: 'Not Started',
    },
    {
      eventName: 'Food Drive',
      date: '2024-12-05',
      requiredSkills: 'Organization, Communication',
      urgency: 'High',
      location: 'Houston Community Center',
      status: 'In Progress',
    },
    {
      eventName: 'Park Cleanup',
      date: '2024-09-29',
      requiredSkills: 'Teamwork, Environmental Awareness',
      urgency: 'Medium',
      location: 'Central Park',
      status: 'Completed',
    },
    {
      eventName: 'Animal Shelter Support',
      date: '2024-08-15',
      requiredSkills: 'Animal Care, Teamwork',
      urgency: 'Low',
      location: 'Los Angeles Animal Shelter',
      status: 'Completed',
    },
    {
      eventName: 'Soup Kitchen Volunteering',
      date: '2024-09-05',
      requiredSkills: 'Communication, Organization',
      urgency: 'High',
      location: 'New York Soup Kitchen',
      status: 'Completed',
    },
    {
      eventName: 'School Supplies Drive',
      date: '2024-08-25',
      requiredSkills: 'Organization, Communication',
      urgency: 'Medium',
      location: 'Houston Elementary School',
      status: 'In Progress',
    },
    {
      eventName: 'Blood Donation Camp',
      date: '2024-10-10',
      requiredSkills: 'Organization, Communication',
      urgency: 'High',
      location: 'San Francisco Community Center',
      status: 'Upcoming',
    },
    {
      eventName: 'Homeless Shelter Assistance',
      date: '2024-07-18',
      requiredSkills: 'Compassion, Organization',
      urgency: 'High',
      location: 'Seattle Homeless Shelter',
      status: 'Completed',
    },
    {
      eventName: 'Public Park Tree Planting',
      date: '2024-09-25',
      requiredSkills: 'Physical Strength, Environmental Awareness',
      urgency: 'Medium',
      location: 'Denver City Park',
      status: 'Not Started',
    },
    {
      eventName: 'Neighborhood Health Fair',
      date: '2024-12-12',
      requiredSkills: 'Healthcare, Communication',
      urgency: 'High',
      location: 'Chicago Community Hall',
      status: 'Upcoming',
    },
    {
      eventName: 'Disaster Relief Assistance',
      date: '2024-11-22',
      requiredSkills: 'First Aid, Teamwork',
      urgency: 'High',
      location: 'Florida Disaster Center',
      status: 'Upcoming',
    },
    {
      eventName: 'Local Library Book Drive',
      date: '2024-08-30',
      requiredSkills: 'Organization, Communication',
      urgency: 'Low',
      location: 'Phoenix Public Library',
      status: 'Completed',
    },
    {
      eventName: 'Elderly Care Volunteering',
      date: '2024-10-18',
      requiredSkills: 'Compassion, Healthcare',
      urgency: 'Medium',
      location: 'Miami Senior Center',
      status: 'Upcoming',
    },
    {
      eventName: 'Park Rangers Support',
      date: '2024-11-05',
      requiredSkills: 'Environmental Awareness, Teamwork',
      urgency: 'Medium',
      location: 'Yellowstone National Park',
      status: 'Upcoming',
    },
    {
      eventName: 'Clothing Donation Sorting',
      date: '2024-09-10',
      requiredSkills: 'Organization, Teamwork',
      urgency: 'Low',
      location: 'Boston Charity Warehouse',
      status: 'Completed',
    }
  ]; */

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
