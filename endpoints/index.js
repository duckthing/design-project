exports.get = function(req, res) {
	res.render("./pages/index.ejs", {});
}
exports.post = function (req, res) {
	res.send("Test Failed");
	return;
}