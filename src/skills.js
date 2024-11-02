const dbSource = require("./dbSource");
const db = dbSource.db;

class Skill {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

const getSkillFromNameStmt = db.prepare("SELECT * FROM skills WHERE skill_name = ?");
function getSkillFromName(skillName) {
	return getSkillFromNameStmt.get(skillName);
}
exports.getSkillFromName = getSkillFromName

const getSkillFromIDStmt = db.prepare("SELECT * FROM skills WHERE skill_id = ?");
function getSkillFromID(skillID) {
	return getSkillFromIDStmt.get(skillID);
}
exports.getSkillFromID = getSkillFromID;

const getAllSkillsStmt = db.prepare("SELECT * FROM skills");
function getAllSkills() {
	return getAllSkillsStmt.all();
}
exports.getAllSkills = getAllSkills;

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