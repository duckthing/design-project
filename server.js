const fs = require("fs");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

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

// Import user-profile-management module
const userProfile = require('./endpoints/user/user-profile-management');

// Register the routes for user profile management
app.get('/user/user-profile-management', userProfile.get);
app.post('/user/user-profile-management', userProfile.post);

let getPaths = []; // For creating the sitemap
function addEndpoints(app, startPath, mountPath) {
    // Recursively go through the startPath (./api/) directory and
    // create endpoints from javascript files

    const relativePaths = fs.readdirSync("." + startPath);

    for (const relativePath of relativePaths) {
        const itemPath = startPath + relativePath;

        fs.stat("." + itemPath, (err, stat) => {
            if (err) {
                console.log("Error: " + err);
            } else {
                if (stat.isDirectory()) {
                    // Recursively call addEndpoints for directories
                    addEndpoints(app, itemPath + "/", mountPath + relativePath + "/");
                } else {
                    // Add this javascript file as an endpoint
                    const mod = require("." + itemPath);
                    const filename = relativePath.substring(0, relativePath.indexOf("."));
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

// Add the endpoints dynamically
addEndpoints(app, "/endpoints/", "/", getPaths);

// Create sitemap at '/sitemap'
require("./endpoints/sitemap").createSites(getPaths);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
