function displayVolunteerHistory() {
  const tableBody = document.querySelector('#volunteer-history tbody');
  tableBody.innerHTML = '';  // Clear the current list

  // Fetch volunteer data from the backend API
  fetch('/api/volunteerData')
    .then(response => response.json())
    .then(volunteerData => {
      volunteerData.forEach(volunteer => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${volunteer.eventName}</td>
          <td>${volunteer.eventDate}</td>
          <td>${volunteer.requiredSkills}</td>
          <td>${volunteer.urgency}</td>
          <td>${volunteer.location}</td>
          <td class="${volunteer.status.toLowerCase().replace(' ', '-')}">${volunteer.status}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching volunteer data:', error));
}

window.onload = displayVolunteerHistory;
