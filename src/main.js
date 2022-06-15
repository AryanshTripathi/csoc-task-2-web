import axios from "axios";
import getTasks from "./init";
import { indexToIdMap } from "./init";

function displaySuccessToast(message) {
	iziToast.success({
		title: "Success",
		message: message,
	});
}

function displayErrorToast(message) {
	iziToast.error({
		title: "Error",
		message: message,
	});
}

function displayInfoToast(message) {
	iziToast.info({
		title: "Info",
		message: message,
	});
}

const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

function logout() {
	localStorage.removeItem("token");
	window.location.href = "/login/";
}

window.logout = logout;

function registerFieldsAreValid(
	firstName,
	lastName,
	email,
	username,
	password
) {
	if (
		firstName === "" ||
		lastName === "" ||
		email === "" ||
		username === "" ||
		password === ""
	) {
		displayErrorToast("Please fill all the fields correctly.");
		return false;
	}
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		displayErrorToast("Please enter a valid email address.");
		return false;
	}
	return true;
}

function register() {
	const firstName = document.getElementById("inputFirstName").value.trim();
	const lastName = document.getElementById("inputLastName").value.trim();
	const email = document.getElementById("inputEmail").value.trim();
	const username = document.getElementById("inputUsername").value.trim();
	const password = document.getElementById("inputPassword").value;

	if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
		displayInfoToast("Please wait...");

		const dataForApiRequest = {
			name: firstName + " " + lastName,
			email: email,
			username: username,
			password: password,
		};

		axios({
			url: API_BASE_URL + "auth/register/",
			method: "post",
			data: dataForApiRequest,
		})
			.then(function ({ data, status }) {
				localStorage.setItem("token", data.token);
				window.location.href = "/";
			})
			.catch(function (err) {
				displayErrorToast(
					"An account using same email or username is already created"
				);
			});
	}
}
window.register = register;

function login() {
	/***
	 * @todo Complete this function.
	 * @todo 1. Write code for form validation.
	 * @todo 2. Fetch the auth token from backend, login and direct user to home page.
	 */

	const inputPassword = document.getElementById("inputPassword").value;
	const inputUsername = document.getElementById("inputUsername").value;

	if (inputPassword != "" && inputUsername != "") {
		const apiData = {
			username: inputUsername,
			password: inputPassword,
		};
		axios({
			method: "POST",
			url: `${API_BASE_URL}auth/login/`,
			data: apiData,
		})
			.then((data) => {
				displayInfoToast("Logged in successfully");
				// console.log("Data.token: ", data.data.token);
				localStorage.setItem("token", data.data.token);
				location.replace("/");
				// console.log("LocalStorage Token: ", localStorage.getItem("token"));
			})
			.catch((err) => {
				displayErrorToast("Invalid Credentials or User does not exist");
			});
	} else {
		displayErrorToast("Please fill all the fields");
	}

	// console.log(typeof inputPassword);
	// console.log(typeof inputUsername);
}
window.login = login;

let cnt = 0;

function addTask() {
	/**
	 * @todo Complete this function.
	 * @todo 1. Send the request to add the task to the backend server.
	 * @todo 2. Add the task in the dom.
	 */
	const taskName = document.getElementById("add-new-task").value;

	// console.log(indexToIdMap);

	const newTaskData = {
		title: taskName,
	};

	axios({
		headers: {
			Authorization: `Token ${localStorage.getItem("token")}`,
		},
		method: "POST",
		url: `${API_BASE_URL}todo/create/`,
		data: newTaskData,
	})
		.then((data) => {
			// console.log(data);
			displayInfoToast("Redirecting...");
			getTasks();
			// console.log(indexToIdMap);
			displaySuccessToast("Task Added");
		})
		.catch((err) => {
			displayErrorToast("Some Error Occurred");
		});

	cnt += 1;
}

window.addTask = addTask;

function editTask(id) {
	document.getElementById("task-" + id).classList.add("hideme");
	document.getElementById("task-actions-" + id).classList.add("hideme");
	document.getElementById("input-button-" + id).classList.remove("hideme");
	document.getElementById("done-button-" + id).classList.remove("hideme");
}

window.editTask = editTask;

function deleteTask(id) {
	/**
	 * @todo Complete this function.
	 * @todo 1. Send the request to delete the task to the backend server.
	 * @todo 2. Remove the task from the dom.
	 */
	displayInfoToast("Deleting the task");
	axios({
		headers: {
			Authorization: `Token ${localStorage.getItem("token")}`,
		},
		method: "DELETE",
		url: `${API_BASE_URL}todo/${indexToIdMap[id]}`,
	})
		.then((data) => {
			// console.log(data);
			displaySuccessToast("Task deleted Successfully");
			getTasks();
			indexToIdMap.splice(id, 1);
		})
		.catch((err) => {
			displayErrorToast("Some Error Occurred");
		});
}

window.deleteTask = deleteTask;

function updateTask(id) {
	/**
	 * @todo Complete this function.
	 * @todo 1. Send the request to update the task to the backend server.
	 * @todo 2. Update the task in the dom.
	 */

	const updatedTask = {
		title: document.getElementById(`input-button-${id}`).value,
	};

	axios({
		method: "PUT",
		url: `${API_BASE_URL}todo/${indexToIdMap[id]}/`,
		headers: {
			Authorization: `Token ${localStorage.getItem("token")}`,
		},
		data: updatedTask,
	})
		.then((data) => {
			// console.log(data);
			displayInfoToast("Updating the task");
			getTasks();
			displaySuccessToast("Updated the task");
		})
		.catch((err) => {
			displayErrorToast("Some Error Occurred");
		});
}

window.updateTask = updateTask;

function searchTask() {
	const task = document.getElementById("search-new-task").value;
	const allTasks = [...document.getElementsByClassName("todo-task")];
	const id = allTasks.findIndex(
		(item) => item.innerText.toLowerCase() == task.toLowerCase()
	);
	console.log(id);

	if (id == -1) {
		displayErrorToast("No Task found");
	} else {
		/* axios({
			method: "GET",
			url: `${API_BASE_URL}todo/${indexToIdMap[id]}/`,
			headers: {
				Authorization: `Token ${localStorage.getItem("token")}`,
			},
		})
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(data);
			}); */

		location.href = `#task-${id}`;
	}
}

window.searchTask = searchTask;

/* Adding the functionality of invoking the function when user presses ENTER key */

document.getElementById("search-new-task").addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		searchTask();
	}
});

document.getElementById("add-new-task").addEventListener("keydown", (e) => {
	if (e.key == "Enter") {
		addTask();
	}
});
