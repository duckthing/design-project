const dbSource = require("../src/dbSource");
const db = dbSource.db;

class Skill {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const getSkillFromNameStmt = db.prepare();
function getSkillFromName(skillName) {
	return getSkillFromNameStmt.get(skillName);
}
exports.getSkillFromName = getSkillFromName

const getSkillFromIDStmt = db.prepare();
function getSkillFromID(skillID) {
	return getSkillFromIDStmt.get(skillID);
}
exports.getSkillFromID = getSkillFromID;

const createNewSkillStmt = db.prepare("INSERT INTO skills(skill_name) VALUES (?)");
function createNewSkill(skillName) {
	if (getSkillFromName(skillName) != null) {
		// Already exists
		return false, "Skill already exists";
	} else {
		const info = createNewSkillStmt.run(skillName);
		return true, getSkillFromID(info.lastInsertRowId);
	}
}
exports.createNewSkill = createNewSkill;

if (dbSource.databaseJustCreated) {
	// Create default skills
}