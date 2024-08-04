document.addEventListener("DOMContentLoaded", () => {
    const locationDeletionChannel = new BroadcastChannel('locationDeletionChannel');

    // Set danger level colors
    const dangerLevels = document.querySelectorAll(".danger-level");
    dangerLevels.forEach(element => {
        const dangerLevel = element.dataset.dangerLevel;
        element.style.backgroundColor = `rgb(${dangerLevel})`;
    });

    // Add event listener to handle click on trash
    document.querySelectorAll(".fa-trash").forEach(trash => trash.addEventListener("click", async (event) => {
        const savedItem = event.target.closest('.saved-item');
        const addressDiv = savedItem.querySelector('.address');
        const address = addressDiv.textContent;
        const data = { address };
        await fetch("/saved-locations", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        // Send message to map page to collapse danger-info div
        locationDeletionChannel.postMessage("closeDangerInfo");

        window.location.reload();
    }));

    // Attach channel handler for reloading page when bookmark gets unfilled
    locationDeletionChannel.onmessage = (event) => {
        if (event.data === 'reloadPage') {
            window.location.reload();
        }
    };
});