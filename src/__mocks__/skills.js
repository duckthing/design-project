// src/__mocks__/skills.js

module.exports = {
    getAllSkills: jest.fn(() => [
      { skill_id: 1, skill_name: 'Skill1' },
      { skill_id: 2, skill_name: 'Skill2' },
    ]),
  };
  