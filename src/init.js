import axios from "axios";
const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

export let indexToIdMap = [];

export default function getTasks() {
	/***
	 * @todo Fetch the tasks created by the user and display them in the dom.
	 */
	axios({
		method: "GET",
		url: `${API_BASE_URL}todo/`,
		headers: {
			Authorization: `Token ${localStorage.getItem("token")}`,
		},
	})
		.then((data) => {
			indexToIdMap = [];
			// console.log(data.data);
			document.querySelector(
				".todo-available-tasks"
			).innerHTML = `<span class="badge badge-primary badge-pill todo-available-tasks-text">
					Available Tasks
				</span>`;
			data.data.map((task, index) => {
				indexToIdMap.push(task.id);
				let a = `<li
						class="list-group-item d-flex justify-content-between align-items-center"
					>
						<input
							id="input-button-${index}"
							type="text"
							class="form-control todo-edit-task-input hideme"
							placeholder="Edit The Task"
						/>
						<div id="done-button-${index}" class="input-group-append hideme">
							<button
								class="btn btn-outline-secondary todo-update-task"
								type="button"
								onclick="updateTask(${index})"
							>
								Done
							</button>
						</div>
						<div id="task-${index}" class="todo-task">${task.title}</div>

						<span id="task-actions-${index}">
							<button
								style="margin-right: 5px"
								type="button"
								onclick="editTask(${index})"
								class="btn btn-outline-warning"
							>
								<img
									src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
									width="18px"
									height="20px"
								/>
							</button>
							<button
								type="button"
								class="btn btn-outline-danger"
								onclick="deleteTask(${index})"
							>
								<img
									src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
									width="18px"
									height="22px"
								/>
							</button>
						</span>
					</li>`;

				document.querySelector(".todo-available-tasks").innerHTML += a;
			});
			// console.log("Map", indexToIdMap);
		})
		.catch((err) => {
			// console.log(err);
		});
}

window.getTasks = getTasks;

if (localStorage.getItem("token")) {
	axios({
		headers: {
			Authorization: "Token " + localStorage.getItem("token"),
		},
		url: API_BASE_URL + "auth/profile/",
		method: "get",
	}).then(function ({ data, status }) {
		document.getElementById("avatar-image").src =
			"https://ui-avatars.com/api/?name=" +
			data.name +
			"&background=fff&size=33&color=007bff";
		document.getElementById("profile-name").innerHTML = data.name;

		getTasks();
	});
}
