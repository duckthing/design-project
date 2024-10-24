const dbSource = require("../src/dbSource");
const db = dbSource.db;

const getStatesStmt = db.prepare("SELECT * FROM states");
const states = getStatesStmt.all();
exports.states = states;