import { lastAddress, lastDangerLevel } from "./search.js";

const locationDeletionChannel = new BroadcastChannel('locationDeletionChannel');

export function attachXmarkClickHandler() {
    // Add event listener for xmark to hide the danger info div
    const xmark = document.querySelector("#danger-info .fa-xmark");
    xmark.addEventListener("click", () => {
        const dangerInfo = document.getElementById("danger-info");
        dangerInfo.classList.toggle("expanded");
    });
}

export function attachBookmarkClickHandler() {
    // Add event listener for bookmark to add/remove the address and danger level to saved locations
    const bookmark = document.querySelector(".fa-bookmark");
    bookmark.addEventListener("click", async () => {
        if (bookmark.classList.contains("fa-regular")) {
            // If the location is not saved, save it
            const data = {
                address: lastAddress,
                dangerLevel: lastDangerLevel
            };
            await fetch('/saved-locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }
        else {
            // If the location is saved, remove it
            const data = {
                address: lastAddress
            }
            await fetch("/saved-locations", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
        }
        bookmark.classList.toggle("fa-regular");
        bookmark.classList.toggle("fa-solid");

        // Send message to the saved-locations page to reload
        locationDeletionChannel.postMessage("reloadPage");
    });
}


export function attachChannelHandler() {
    locationDeletionChannel.onmessage = (event) => {
        if (event.data === 'closeDangerInfo') {
            const dangerInfo = document.getElementById("danger-info");
            if (dangerInfo.classList.contains("expanded")) {
                dangerInfo.classList.toggle("expanded");
            }
        }
    };
}

let touchstartY = 0;
let touchendY = 0;
export function attachSwipeHandler() {
    const dangerInfo = document.getElementById("danger-info");

    dangerInfo.addEventListener('touchstart', handleTouchStart);
    dangerInfo.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(event) {
    touchstartY = event.changedTouches[0].screenY;
}

function handleTouchEnd(event) {
    touchendY = event.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (Math.abs(touchendY - touchstartY) > swipeThreshold) {
        const dangerInfo = document.getElementById("danger-info");
        if (touchendY > touchstartY) {
            dangerInfo.classList.add("hidden");
        }
        else {
            dangerInfo.classList.remove("hidden");
        }
    }
}