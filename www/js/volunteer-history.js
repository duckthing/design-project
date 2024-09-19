const volunteerData = [
  {
    eventName: 'Beach Cleanup',
    eventDate: '2024-10-01',
    requiredSkills: 'Teamwork, Environmental Awareness',
    urgency: 'High',
    location: 'Santa Monica Beach',
    status: 'Completed'
  },
  {
    eventName: 'Community Garden',
    eventDate: '2024-09-20',
    requiredSkills: 'Gardening, Communication',
    urgency: 'Medium',
    location: 'Central Park',
    status: 'In Progress'
  },
  {
    eventName: 'Tree Planting',
    eventDate: '2024-11-15',
    requiredSkills: 'Environmental Awareness, Physical Stamina',
    urgency: 'Low',
    location: 'Golden Gate Park',
    status: 'Not Started'
  },
  {
    eventName: 'Food Drive',
    eventDate: '2024-12-05',
    requiredSkills: 'Organization, Communication',
    urgency: 'High',
    location: 'Houston Community Center',
    status: 'In Progress'
  },
  {
    eventName: 'Park Cleanup',
    eventDate: '2024-09-29',
    requiredSkills: 'Teamwork, Environmental Awareness',
    urgency: 'Medium',
    location: 'Central Park',
    status: 'Completed'
  }
];

const tableBody = document.querySelector('#volunteer-history tbody');

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