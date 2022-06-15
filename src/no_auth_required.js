/***
 * @todo Redirect the user to main page if token is present.
 */

if (localStorage.getItem("token") != undefined) {
	displaySuccessToast("Redirecting");
	location.replace("/");
}
