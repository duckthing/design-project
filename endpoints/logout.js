exports.get = function(req, res) {
	req.session.destroy((err) => {
		if (err) {
				console.error('Error logging out:', err);
				return res.status(500).send("Error logging out.");
		}
		res.redirect("/login");
	});
}