const db = require('../../src/dbSource').db;
const path = require('path');

exports.get = function(req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }

    // Query to get all events with event_id included
    const events = db.prepare(`
        SELECT event_id, event_name, event_date, address, city, state_code, urgent 
        FROM events
        ORDER BY event_date
    `).all();

    /* console.log("Retrieved events:", events);*/
    
    res.render(path.join(__dirname, '../../views/pages/user/events'), {
        events: events,
        session: req.session
    });
};
