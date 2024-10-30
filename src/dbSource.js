const Database = require("better-sqlite3");
const db = new Database("./data/database.db"/*, {verbose: console.log}*/);
exports.db = db;

// Check if the database was initialized.
// If not, run the init schemas.
exports.databaseJustCreated = false;
do {
	const stmt = db.prepare("SELECT name FROM sqlite_master");
	const tableNames = stmt.all();
	if (tableNames.length == 0) {
		// Empty table, run the schemas
		exports.databaseJustCreated = true;
		const fs = require("fs");
		const createSchema = fs.readFileSync('./data/schema/create_db.sql', 'utf8');
		db.exec(createSchema);
		const insertDefaultSchema = fs.readFileSync('./data/schema/insert_defaults.sql', 'utf8');
		db.exec(insertDefaultSchema);
	}
} while (false);

// Close database connection when process exits
// #region
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
// #endregion