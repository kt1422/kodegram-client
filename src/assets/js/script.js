//show password
export const showPassword = () => {
	const x = document.getElementById("password");
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}

//dynamic change of titles
export const setTitle = (newTitle) => {
    return (document.title = newTitle);
}

// if (window.matchMedia('screen and (max-width: 680px)').matches) {
//     const myCollapsible = new bootstrap.Collapse("#collapseConvo");
//     myCollapsible.hide();
// }