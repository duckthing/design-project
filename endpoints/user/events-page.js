const db = require('../../src/dbSource').db;
const path = require('path');

exports.get = function(req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }

    const highlightedEventId = req.query.highlight || null;
    
    // Query to get all events with event_id included
    const events = db.prepare(`
        SELECT event_id, event_name, event_date, address, city, state_code, urgent, description 
        FROM events
        ORDER BY event_date
    `).all();
    
    res.render(path.join(__dirname, '../../views/pages/user/events'), {
        events: events,
        highlightedEventId: highlightedEventId,
        session: req.session
    });
};
