const accountsModule = require("../../src/accounts");

exports.get = function(req, res) {
    if (req.session.user) {
        const account = accountsModule.getUserAccount(req.session.user.username);
        if (!account) {
            return res.redirect("/login");  // Handle case where account is not found
        }
        res.render("pages/user/user-profile-management", { user: account });
    } else {
        res.redirect("/login");
    }
};

exports.post = function(req, res) {
    const { fullName, address1, address2, city, state, skillSelect, preferences, availability } = req.body;

    // Basic validation for required fields
    if (!fullName || !address1 || !city || !state || !availability) {
        return res.status(400).send("Please fill all required fields.");
    }

    const skills = Array.isArray(skillSelect) ? skillSelect : [skillSelect];

    // Update the user's account with the new data
    const updatedAccount = {
        fullName,
        address1,
        address2,
        city,
        state,
        preferences: preferences || "No preferences",
        availability,
        skills,
    };

    accountsModule.updateUserAccount(req.session.user.username, updatedAccount);

    // Redirect back to the profile management page
    res.redirect("/user/user-profile-management");
};
