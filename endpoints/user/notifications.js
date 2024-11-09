const path = require('path');
const accountsModule = require("../../src/accounts");
const db = require("../../src/dbSource").db;

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
  try {
    const testStmt = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\'');
    const tables = testStmt.all();
    /* console.log("Database tables:", tables); */
  } catch (error) {
      console.error("Database error:", error);
      return res.status(500).send("Database connection issue.");
  }


	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}

  // Retrieve notifications from database
  try {
    const notificationsData = db.prepare(`
      SELECT notification_id AS id, notification_text AS message, 'New Event' AS type
      FROM user_notifications
      WHERE user_account_id = ?
      AND dismissed = 0
    `).all(req.session.user.user_account_id);

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
      session: req.session
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.dismissNotification = function(req, res) {
  const { notificationId } = req.params;
  
  try {
    db.prepare(`
      UPDATE user_notifications
      SET dismissed = 1
      WHERE notification_id = ?
      AND user_account_id = ?
    `).run(notificationId, req.session.user.user_account_id);

    res.redirect('/user/notifications');
  } catch (error) {
    console.error("Error dismissing notification:", error);
    res.status(500).send("Internal Server Error");
  }
};
