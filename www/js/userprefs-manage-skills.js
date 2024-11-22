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

	const actionsColumn = document.createElement("td");

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.className = "fill cancel";
	// deleteButton.onclick = `userprefsRemoveSkill(${id})`;
	deleteButton.addEventListener("click", () => {userprefsRemoveSkill(id);}, false);
	deleteButton.innerText = "Remove";

	actionsColumn.insertAdjacentElement("afterbegin", deleteButton)
	tr.insertAdjacentElement("beforeend", skillColumn);
	tr.insertAdjacentElement("beforeend", actionsColumn);

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