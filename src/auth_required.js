/***
 * @todo Redirect the user to login page if token is not present.
 */

console.log(localStorage.getItem("token"));

if (localStorage.getItem("token") == undefined) {
	location.replace("../login/index.html");
}
