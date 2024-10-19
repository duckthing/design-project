const volunteerData = [
  { eventName: 'Beach Cleanup', eventDate: '2024-10-01', requiredSkills: 'Teamwork, Environmental Awareness', urgency: 'High', location: 'Santa Monica Beach', status: 'Completed' },
  { eventName: 'Community Garden', eventDate: '2024-09-20', requiredSkills: 'Gardening, Communication', urgency: 'Medium', location: 'Central Park', status: 'In Progress' },
  { eventName: 'Tree Planting', eventDate: '2024-11-15', requiredSkills: 'Environmental Awareness, Physical Stamina', urgency: 'Low', location: 'Golden Gate Park', status: 'Not Started' },
  { eventName: 'Food Drive', eventDate: '2024-12-05', requiredSkills: 'Organization, Communication', urgency: 'High', location: 'Houston Community Center', status: 'In Progress' },
  { eventName: 'Park Cleanup', eventDate: '2024-09-29', requiredSkills: 'Teamwork, Environmental Awareness', urgency: 'Medium', location: 'Central Park', status: 'Completed' }
];


exports.get = function(req, res) {
  res.json(volunteerData);
};