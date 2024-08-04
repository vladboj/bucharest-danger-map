function toggleMenu() {
    document
        .getElementById("menu")
        .classList
        .toggle("expanded");
}

export function attachToggleMenuHandler() {
    document
        .getElementById("menu-trigger")
        .addEventListener("click", toggleMenu);
}


async function logout(event) {
    event.preventDefault();
    const response = await fetch("/auth/logout", { method: "DELETE" });
    if (response.ok) {
        window.location.href = "/auth/login";
    }
}

export function attachLogoutHandler() {
    const logoutAnchor = document.querySelector("#menu-options > a:last-child");
    logoutAnchor.addEventListener("click", logout);
}