PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS states (
    state_code			TEXT PRIMARY KEY NOT NULL,
    state_name			TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_accounts (
	user_account_id		INTEGER PRIMARY KEY,
	username			TEXT NOT NULL UNIQUE,
	password			TEXT NOT NULL,
	full_name			TEXT NOT NULL,
	address1			TEXT NOT NULL,
	address2			TEXT NULL,
	city				TEXT NOT NULL,
	state_code			TEXT NOT NULL,
	zipcode				INTEGER NOT NULL,
	preferences			TEXT,

	FOREIGN KEY (state_code)
		REFERENCES states (state_code)
			ON UPDATE CASCADE
			ON DELETE RESTRICT
);

CREATE INDEX idx_user_city
ON user_accounts (city);

CREATE TABLE IF NOT EXISTS skills (
	skill_id			INTEGER PRIMARY KEY,
	skill_name			TEXT NOT NULL UNIQUE
);

-- User can have multiple skills
CREATE TABLE IF NOT EXISTS has_skills (
	skill_id			INTEGER NOT NULL,
	user_account_id		INTEGER NOT NULL,

	PRIMARY KEY (skill_id, user_account_id),

	FOREIGN KEY (skill_id)
		REFERENCES skills (skill_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,

	FOREIGN KEY (user_account_id)
		REFERENCES user_accounts (user_account_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_available_at (
	user_account_id		INTEGER PRIMARY KEY,
	from_date			INT NOT NULL,
	to_date				INT NOT NULL,

	FOREIGN KEY (user_account_id)
		REFERENCES user_accounts (uesr_account_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS organizer_accounts (
	organizer_account_id	INTEGER PRIMARY KEY,
	username			TEXT NOT NULL UNIQUE,
	password			TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
	event_id			INTEGER PRIMARY KEY,
	event_name			TEXT NOT NULL,
	address				TEXT NOT NULL,
	city				TEXT NOT NULL,
	state_code			TEXT NOT NULL,
	urgent				INTEGER NOT NULL,
	event_date			INT NOT NULL,

	FOREIGN KEY (state_code)
		REFERENCES states (state_code)
			ON UPDATE CASCADE
			ON DELETE RESTRICT
);

CREATE INDEX idx_event_city
ON events (city);

CREATE TABLE IF NOT EXISTS event_requires_skills (
	event_id			INTEGER PRIMARY KEY,
	skill_id			INTEGER NOT NULL,

	FOREIGN KEY (event_id)
		REFERENCES events (event_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,

	FOREIGN KEY (skill_id)
		REFERENCES skills (skill_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_decisions (
	user_account_id		INTEGER NOT NULL,
	event_id			INTEGER NOT NULL,

	FOREIGN KEY (user_account_id)
		REFERENCES user_accounts (user_account_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,

	FOREIGN KEY (event_id)
		REFERENCES events (event_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_notifications (
	notification_id		INTEGER PRIMARY KEY,
	user_account_id		INTEGER NOT NULL,
	notification_text	TEXT NOT NULL,
	dismissed			INTEGER NOT NULL DEFAULT 0,

	FOREIGN KEY (user_account_id)
		REFERENCES user_accounts (user_account_id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE INDEX idx_user_notifications
ON user_notifications (user_account_id);