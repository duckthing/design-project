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

function displayNotifications() {
  const notificationList = document.getElementById('notificationList');

  notificationList.innerHTML = '';

  notifications.forEach(notification => {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.setAttribute('id', notification.id);

    const message = `
      <p><strong>${notification.type}:</strong> ${notification.message}</p>
      <button onclick="dismissNotification('${notification.id}')">Dismiss</button>
    `;

    notificationDiv.innerHTML = message;
    notificationList.appendChild(notificationDiv);
  });
}

function dismissNotification(notificationId) {
  const notification = document.getElementById(notificationId);
  if (notification) {
    notification.style.display = 'none';
  }

  checkRemaining();
}

function checkRemaining() {
  const remainingNotifications = Array.from(document.querySelectorAll('.notification'));
  let allDismissed = true;

  remainingNotifications.forEach(notification => {
    if (notification.style.display !== 'none') {
      allDismissed = false;
    }
  });

  if (allDismissed) {
    const notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = `
      <p>No more notifications</p>
      <button id="home-page">Home</button>
    `;

    const homeButton = document.getElementById('home-page');
    homeButton.addEventListener('click', function() {
      window.location.href = '/';
    });

  }
}

window.onload = displayNotifications;