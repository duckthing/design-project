const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const accountsModule = require('./src/accounts.js');
const stateModule = require('./data/states.js');
const skillModule = require('./data/skills.js');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static("static"));
app.use("/css", express.static("www/css"));
app.use("/img", express.static("www/img"));
app.use("/js", express.static("www/js"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: false,
	})
);

app.get('/', (req, res) => {
	res.render('pages/index', { session: req.session });
});


app.get('/login', (req, res) => {
	res.render('pages/login', { session: req.session });
});

const loginAPI = require('./endpoints/login.js');
app.post('/login', loginAPI.post);

app.get('/volunteer-history', (req, res) => {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}
	const volunteerHistory = require('./endpoints/organizer/volunteer-history');
	volunteerHistory.get(req, res, req.session);
});

app.get('/user/user-profile-management', (req, res) => {
	if (!req.session.isAuthenticated) {
			return res.redirect('/login');
	}


	const userAccount = accountsModule.getUserAccount(req.session.user.username);

	if (!userAccount) {
			return res.status(404).send("User not found");
	}

	res.render('pages/user/user-profile-management', {
			user: userAccount,
			stateModule: stateModule,
			skillModule: skillModule,
			session: req.session
		});
});


app.get('/notifications', (req, res) => {
	if (!req.session.isAuthenticated) {
		return res.redirect('/login');
	}
	const notificationsAPI = require('./endpoints/user/notifications');
	notificationsAPI.get(req, res);
});

app.get('/logout', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/login');
	});
});


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