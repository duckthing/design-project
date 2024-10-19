exports.get = function(req, res) {
	if (req.session.organizer) {
		res.render("./pages/organizer/volunteer-history.ejs", {});
	} else {
		res.redirect("/login");
	}
}