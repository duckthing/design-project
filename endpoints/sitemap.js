let sites = []

// Array of strings/endpoints
exports.createSites = function(endpoints) {
	sites = endpoints;
}

exports.get = function(req, res) {
	res.render("./pages/sitemap.ejs", {sites: sites});
}