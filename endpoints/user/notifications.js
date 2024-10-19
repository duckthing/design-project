const notifications = [
  {
    id: 'notification1',
    message: 'You have been assigned to the "Beach Cleanup" event on 12-30-2024.',
    type: 'New Event'
  },
  {
    id: 'notification2',
    message: 'The "Catch an Alligator" event starts on Friday.',
    type: 'Reminder'
  },
  {
    id: 'notification3',
    message: 'Don\'t forget "Cloudy With a Chance of Meatballs" event starts next week.',
    type: 'Reminder'
  }
];

exports.get = function(req, res) {
  res.json(notifications);
};
