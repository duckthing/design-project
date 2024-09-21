/*
<tr id="skillId">
	<td>skillName</td>
	<td><button type="button" class="fill cancel" onclick="userprefsRemoveSkill('skillId')">Remove</button></td>
</tr>
*/

// Creates and returns the new row
function userprefsCreateSkillRow(id, name) {
	const tr = document.createElement("tr");
	tr.id = id;

	const skillColumn = document.createElement("td");
	skillColumn.innerText = name;

	const deleteColumn = document.createElement("button");
	deleteColumn.type = "button";
	deleteColumn.className = "fill cancel";
	// deleteColumn.onclick = `userprefsRemoveSkill(${id})`;
	deleteColumn.addEventListener("click", () => {userprefsRemoveSkill(id);}, false);
	deleteColumn.innerText = "Remove";

	tr.insertAdjacentElement("beforeend", skillColumn);
	tr.insertAdjacentElement("beforeend", deleteColumn);

	return tr
}

function userprefsAddSkill() {
	let dropdown = document.getElementById("skillSelect");
	let skillElement = dropdown.options[dropdown.selectedIndex];
	let skillId = skillElement.value;
	let skillName = skillElement.innerHTML;
	if (document.getElementById(skillId)) {
		alert("This skill is already in the table.");
		return;
	}
	let skillTable = document.getElementById("selectedSkillTable");
	skillTable.getElementsByTagName("tbody")[0].insertAdjacentElement(
		"beforeend",
		userprefsCreateSkillRow(skillId, skillName)
	);
}

function userprefsRemoveSkill(id) {
	let row = document.getElementById(id);
	row.remove();
}