// endpoints/user/user-profile-management.js

const accountsModule = require('../../src/accounts');
const skillsModule = require('../../src/skills');
const statesModule = require('../../src/states');

exports.get = function (req, res) {
  if (!req.session || !req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const user = accountsModule.getUserByUsername(req.session.user.username);
    const allSkills = skillsModule.getAllSkills();
    const allStates = statesModule.getAllStates();
    const userSkills = accountsModule.getSkillsByUserID(user.user_account_id);
    const userAvailability = accountsModule.getAvailabilityByUserID(user.user_account_id);

    res.render('pages/user/user-profile-management', {
      profile: user,
      allSkills,
      allStates,
      userSkills,
      userAvailability,
      session: req.session,
    });
  } catch (error) {
    console.error('Error in user-profile-management GET:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.post = function (req, res) {
  if (!req.session || !req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const {
      fullName,
      address1,
      address2,
      city,
      state,
      zipcode,
      preferences,
      skills,
      availability,
    } = req.body;

    if (!fullName || !address1 || !city || !state) {
      return res.status(400).send('Please fill all required fields.');
    }

    accountsModule.updateUserAccountProfile(
      req.session.user.user_account_id,
      req.session.user.username,
      null, // Assuming password is not being updated
      fullName,
      address1,
      address2,
      city,
      state,
      zipcode,
      preferences,
      skills ? skills.split(',') : [],
      availability ? availability.split(',') : []
    );

    res.redirect('/user/user-profile-management');
  } catch (error) {
    console.error('Error in user-profile-management POST:', error);
    res.status(500).send('Internal Server Error');
  }
};
