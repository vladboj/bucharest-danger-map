import { attachAuthClickOutsideHandler } from "../utils/clickOutside.js";

document.addEventListener("DOMContentLoaded", () => {
    attachAuthClickOutsideHandler();

    const loginForm = document.getElementById("signup-form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const data = { username, password };

        const response = await fetch("/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = "/map";
        }
        else {
            const errorData = await response.json();
            const errorContainer = document.getElementById("error-container");
            const errorMessage = document.getElementById("error-message");
            if (errorData.error === "username_exists") {
                errorMessage.textContent = "Username already exists!";
            }
            errorContainer.classList.add("shown");
        }
    });
});