let data = {
	fullName: "John Doe",
	address1: "123 Real Street",
	address2: "",
	city: "Houston",
	state: "TX",
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