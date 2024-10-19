class Skill {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

let skills = [];
let skillsMap = {};

skills.push(new Skill("skill1", "Skill 1"));
skills.push(new Skill("skill2", "Skill 2"));
skills.push(new Skill("skill3", "Skill 3"));
skills.push(new Skill("skill4", "Skill 4"));
skills.push(new Skill("skill5", "Skill 5"));
skills.push(new Skill("moving", "Moving"));
skills.push(new Skill("misc", "Miscellaneous"));

skills.forEach(function(skill) {
	skillsMap[skill.id] = skill;
})

exports.skills = skills;
exports.skillsMap = skillsMap;