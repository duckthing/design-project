const Database = require("better-sqlite3");
const db = new Database("./data/database.db", {verbose: console.log});

// Check if the database was initialized.
// If not, run the init schemas.
do {
	const stmt = db.prepare("SELECT name FROM sqlite_master");
	const tableNames = stmt.all();
	if (tableNames.length == 0) {
		// Empty table, run the schemas
		const fs = require("fs");
		const createSchema = fs.readFileSync('./data/schema/create_db.sql', 'utf8');
		db.exec(createSchema);
		const insertDefaultSchema = fs.readFileSync('./data/schema/insert_defaults.sql', 'utf8');
		db.exec(insertDefaultSchema);
	}
} while (false);

const getStatesStmt = db.prepare("SELECT * FROM states");
function getStates() {
	return getStatesStmt.all();
}
exports.getStates = getStates;

const getUserByUsernameStmt = db.prepare("SELECT * FROM user_accounts WHERE username = ?");
function getUserByUsername(username) {
	return getUserByUsernameStmt.get(username);
}
exports.getUserByUsername = getUserByUsername;

const getOrganizerByUsernameStmt = db.prepare("SELECT * FROM organizer_accounts WHERE username = ?");
function getOrganizerByUsername(username) {
	return getOrganizerByUsernameStmt.get(username);
}
exports.getOrganizerByUsername = getOrganizerByUsername;

exports.db = db;