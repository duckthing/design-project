const fs = require("fs");
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.use(express.static(path.join(__dirname, 'static')));
app.use("/css", express.static("www/css"));
app.use("/img", express.static("www/img"));
app.use("/js", express.static("www/js"));

app.get('/', (req, res) => {
  res.render('index', {});
});

const volunteerHistoryAPI = require('./endpoints/organizer/volunteer-history');
const notificationsAPI = require('./endpoints/user/notifications');



// Serve API data for front-end (volunteer data)
app.get('/api/volunteerData', volunteerHistoryAPI.get);

// Serve API data for front-end (notifications)
app.get('/api/notifications', notificationsAPI.get);


app.get('/notifications', (req, res) => {
  res.render('user/notifications', {});
});
app.get('/volunteer-history', (req, res) => {
  res.render('organizer/volunteer-history', {});
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: false,
	})
);

let getPaths = []; // For creating the sitemap
function addEndpoints(app, startPath, mountPath) {
	// Recursively go through the startPath (./api/) directory and
	// create endpoints from javascript files

	// Note: Modules must add security themselves

	const relativePaths = fs.readdirSync("." + startPath);

	for (const relativePath of relativePaths) {
		const itemPath = startPath + relativePath;

		fs.stat("." + itemPath, (err, stat) => {
			if (err) {
				// An error occurred reading the file system
				console.log("Error: " + err);
			}
			else {
				// We have access to this item
				// It may be a file or directory (folder)
				if (stat.isDirectory()) {
					// Read this again
					addEndpoints(app, itemPath + "/", mountPath + relativePath + "/");
				}
				else {
					// Add this javascript file as an endpoint
					const mod = require("." + itemPath);
					const filename = relativePath.substring(0, relativePath.indexOf("."))
					const endpointPath = filename == "index" ? mountPath : mountPath + filename;

					if (mod.get != null) {
						console.log(endpointPath);
						app.get(endpointPath, mod.get);
						getPaths.push(endpointPath);
					}
					
					if (mod.post != null) {
						console.log("POST: " + endpointPath);
						app.post(endpointPath, mod.post);
					}

					/*
					if (mod.put != null) {
						app.put(endpointPath, mod.put);
					}

					if (mod.delete != null) {
						app.delete(endpointPath, mod.delete);
					}
					*/
				}
			}
		})
	}
};

// Add the endpoints
addEndpoints(app, "/endpoints/", "/", getPaths);
require("./endpoints/sitemap").createSites(getPaths); // Make the sitemap at '/sitemap'

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});