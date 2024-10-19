const accountsModule = require("../../src/accounts");

exports.get = function(req, res) {
    if (req.session.user) {
        const account = accountsModule.getUserAccount(req.session.user.username);
        if (!account) {
            return res.redirect("/login");  // Handle case where account is not found
        }
        res.render("pages/user/user-profile-management", { user: account, require: require });
    } else {
        res.redirect("/login");
    }
};

exports.post = function(req, res) {
	if (req.session.user == null) return res.redirect("/login");
    const { fullName, address1, address2, city, state, skills, preferences, availability } = req.body;
	
    // Basic validation for required fields
    if (!fullName || !address1 || !city || !state || !availability) {
		return res.status(400).send("Please fill all required fields.");
    }
	
	const account = accountsModule.getUserAccount(req.session.user.username);
	if (!account) {
		// Account doesn't exist
        return res.status(400).send("Account does not exist.");
	} else {
		// Update the account and redirect back when done
		account.fullName = fullName;
		account.address1 = address1;
		account.address2 = address2 != null ? address2 : "";
		account.city = city;
		account.state = state;
		account.skills = skills.split(",");
		account.preferences = preferences;
		account.availability = new Date(availability);
		return res.redirect("/user/user-profile-management");
	}

	let x = new Date();
};
