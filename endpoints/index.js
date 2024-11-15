const db = require("../src/dbSource").db;

exports.get = function(req, res) {
    // Get 2-3 upcoming events to feature
    const featuredEvents = db.prepare(`
        SELECT 
            event_id, 
            event_name, 
            event_date,
            city, 
            state_code,
            datetime(event_date, 'unixepoch') as formatted_date
        FROM events 
        WHERE datetime(event_date, 'unixepoch') > datetime('now')
        ORDER BY event_date 
        LIMIT 3
    `).all();

/*  Log the events for debugging
    console.log('Featured Events:', featuredEvents); */

    res.render("./pages/index.ejs", {
        featuredEvents: featuredEvents,
        session: req.session
    });
}

exports.post = function (req, res) {
    res.send("Test Failed");
    return;
} 