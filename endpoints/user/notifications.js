// endpoints/user/notifications.js

const accountsModule = require('../../src/accounts');

exports.get = function (req, res) {
  // Check if the user is authenticated
  if (!req.session || !req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    // Retrieve notifications for the logged-in user
    const notifications = accountsModule.getUserNotifications(req.session.user.user_account_id);

    // Respond with the notifications in JSON format
    res.json({ notifications });
  } catch (error) {
    console.error('Error in notifications GET:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.dismiss = function (req, res) {
  // Check if the user is authenticated
  if (!req.session || !req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  // Extract the notification ID from the request parameters
  const notificationId = req.params.id;

  try {
    // Dismiss the notification for the user
    accountsModule.dismissNotification(req.session.user.user_account_id, notificationId);

    // Respond with a success message
    res.status(200).send('Notification dismissed');
  } catch (error) {
    console.error('Error in notifications DISMISS:', error);
    res.status(500).send('Internal Server Error');
  }
};
