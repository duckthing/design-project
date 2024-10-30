const path = require('path');
const accountsModule = require("../../src/accounts");

function validateNotification(notification) {
  const requiredFields = ['id', 'message', 'type'];

  for (const field of requiredFields) {
    if (!notification[field]) {
      return `Missing required field: ${field}`;
    }
  }

  const validTypes = ['New Event', 'Reminder', 'Alert'];
  if (!validTypes.includes(notification.type)) {
    return `Invalid type value for notification "${notification.id}": ${notification.type}`;
  }

  return null;
}

exports.get = function(req, res) {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}
  /* const notificationsData = [
    {
      id: 'notification1',
      message: 'You have been assigned to the "Beach Cleanup" event on 12-30-2024.',
      type: 'New Event',
    },
    {
      id: 'notification2',
      message: 'The "Catch an Alligator" event starts on Friday.',
      type: 'Reminder',
    },
    {
      id: 'notification3',
      message: 'Don\'t forget "Cloudy With a Chance of Meatballs" event starts next week.',
      type: 'Reminder',
    },
  ]; */

  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Retrieve notifications from database
  const notificationsData = accountsModule.getUserNotifications(req.session.user.user_account_id);

	// Validate each notification
  const errors = [];
  notificationsData.forEach((notification, index) => {
    const validationError = validateNotification(notification);
    if (validationError) {
      errors.push(`Notification #${index + 1}: ${validationError}`);
    }
  });

  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    return res.status(400).send('Error validating notification data: ' + errors.join(', '));
  }

  // Render the EJS view and pass the notifications data to it
  res.render(path.join(__dirname, '../../views/pages/user/notifications'), {
    notifications: notificationsData,
  });
};