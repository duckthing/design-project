// endpoints/login.js

const accountsModule = require("../src/accounts");

exports.get = function (req, res) {
  res.render("./pages/login.ejs", { session: req.session });
};

exports.post = function (req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).send("Invalid data");
  }

  const userAccount = accountsModule.getUserByUsername(req.body.username);
  const organizerAccount = accountsModule.getOrganizerByUsername(req.body.username);

  if (userAccount) {
    // User account exists
    if (userAccount.password !== req.body.password) {
      // Incorrect password
      return res.status(401).render('pages/login', {
        session: req.session,
        error: 'Invalid password',
      });
    } else {
      // Correct password
      req.session.user = {
        username: req.body.username,
        role: 'user',
        user_account_id: userAccount.user_account_id,
      };
      req.session.isAuthenticated = true;
      return res.redirect("/user/user-profile-management");
    }
  } else if (organizerAccount) {
    // Organizer account exists
    if (organizerAccount.password !== req.body.password) {
      // Incorrect password
      return res.status(401).render('pages/login', {
        session: req.session,
        error: 'Invalid password',
      });
    } else {
      // Correct password
      req.session.organizer = {
        username: req.body.username,
        role: 'organizer',
      };
      req.session.isAuthenticated = true;
      return res.redirect("/organizer/event-creation-page");
    }
  } else {
    // No account found
    console.log(`No account exists: ${req.body.username}`);
    return res.status(401).render('pages/login', {
      session: req.session,
      error: 'Invalid username or password',
    });
  }
};
