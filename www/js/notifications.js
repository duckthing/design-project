function displayNotifications() {
  const notificationList = document.getElementById('notificationList');
  notificationList.innerHTML = '';  // Clear the current list

  // Fetch notifications from the backend API
  fetch('/api/notifications')
    .then(response => response.json())
    .then(notifications => {
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
    })
    .catch(error => console.error('Error fetching notifications:', error));
}

function dismissNotification(notificationId) {
  const notification = document.getElementById(notificationId);
  if (notification) {
    notification.style.display = 'none';
  }
}

window.onload = displayNotifications;
