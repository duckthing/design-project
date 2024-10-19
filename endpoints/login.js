const accountsModule = require("../src/accounts");
const bodyParser = require('body-parser');

exports.get = function (req, res) {
  res.render("./pages/login.ejs", {});
};

exports.post = function (req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(400).send("Invalid data");
    return;
  }

  const account = accountsModule.getUserAccount(req.body.username);
  if (!account) {
    res.status(401).send("Invalid username");
    return;
  }

  if (account.password !== req.body.password.trim()) {
    res.status(401).send("Invalid password");
    return;
  }

  req.session.user = { username: req.body.username };
  res.redirect("/user/user-profile-management");
}
