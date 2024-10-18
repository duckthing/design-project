let data = {
	fullName: "John Doe",
	address1: "123 Real Street",
	address2: "",
	city: "Houston",
	state: "TX",
	allSkills: [
		{
			id: "moving",
			name: "Moving",
		},
		{
			id: "misc",
			name: "Miscellaneous",
		},
		{
			id: "moving",
			name: "Moving",
		},
	],
	chosenSkills: [
		"moving"
	],
	preferences: "No preferences",
	availability: "01/02/2024",
	require: require,
};


exports.get = function(req, res) {
	res.render("./pages/user/user-profile-management.ejs", data);
}