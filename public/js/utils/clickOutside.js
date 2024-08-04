export function attachMapClickOutsideHandler() {
    document.addEventListener('click', (event) => {
        const searchbox = document.getElementById('searchbox');
        const searchboxOptions = document.getElementById('searchbox-input-options');
        const menu = document.getElementById('menu');
        const menuTrigger = document.getElementById('menu-trigger');

        if (!searchbox.contains(event.target)) {
            searchbox.classList.remove('expanded');
            searchboxOptions.classList.remove('expanded');
        }

        if (!menu.contains(event.target) && !menuTrigger.contains(event.target)) {
            menu.classList.remove('expanded');
        }
    });
}

export function attachAuthClickOutsideHandler() {
    document.addEventListener("click", (event) => {
        const errorContainer = document.getElementById("error-container");

        if (!errorContainer.contains(event.target)) {
            errorContainer.classList.remove("shown");
        }
    });
}