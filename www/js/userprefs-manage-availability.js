/*
<tr id="skillId">
	<td>skillName</td>
	<td><button type="button" class="fill cancel" onclick="userprefsRemoveSkill('skillId')">Remove</button></td>
</tr>
*/

// Creates and returns the new row
function userprefsCreateDateRow(dateSelection) {
	const tr = document.createElement("tr");
	tr.id = dateSelection;

	const dateColumn = document.createElement("td");
	dateColumn.innerText = dateSelection;

	const deleteColumn = document.createElement("button");
	deleteColumn.type = "button";
	deleteColumn.className = "fill cancel";
	// deleteColumn.onclick = `userprefsRemoveSkill(${id})`;
	deleteColumn.addEventListener("click", () => {userprefsRemoveSkill(tr.id);}, false);
	deleteColumn.innerText = "Remove";

	tr.insertAdjacentElement("beforeend", dateColumn);
	tr.insertAdjacentElement("beforeend", deleteColumn);

	return tr
}

function userprefsAddAvailability() {
	let inputElement = document.getElementById("dateSelect");
	let dateSelection = inputElement.value;
	if (dateSelection == "") {
		return;
	}
	if (document.getElementById(dateSelection)) {
		alert("This date is already in the table.");
		return;
	}
	let date = new Date(dateSelection);
	if (date.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000) {
		alert("Please choose a date in the future.")
		return;
	}
	let availabilityTable = document.getElementById("selectedAvailabilityTable");
	availabilityTable.getElementsByTagName("tbody")[0].insertAdjacentElement(
		"beforeend",
		userprefsCreateDateRow(dateSelection)
	);
}

function userprefsRemoveAvailability(id) {
	let row = document.getElementById(id);
	row.remove();
}