const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("static"));
app.use("/css", express.static("www/css"));
app.use("/img", express.static("www/img"));
app.use("/js", express.static("www/js"));

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
					const endpointPath = mountPath + relativePath.substring(0, relativePath.indexOf("."));

					if (mod.get != null) {
						console.log(endpointPath);
						app.get(endpointPath, mod.get);
					}

					if (mod.post != null) {
						app.post(endpointPath, mod.get);
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
addEndpoints(app, "/endpoints/", "/");

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});