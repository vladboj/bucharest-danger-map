import { getDangerLevel } from "../dangerLevel/logic.js";
import { addMarker } from "./map.js";

export let lastPlaceId = null;
export let lastAddress = null;
export let lastDangerLevel = null;

async function handleSearch(map, address) {
    // Expand searchbox and options
    const searchbox = document.getElementById("searchbox");
    searchbox.classList.add("expanded");
    const searchboxInputOptions = document.getElementById("searchbox-input-options");
    searchboxInputOptions.innerHTML = "<hr />";
    searchboxInputOptions.classList.add("expanded");

    // Retrieve the address options and either display them
    // or "No address found" if the API call returns nothing
    const options = await fetchAddressOptions(address);
    if (options.length === 0) {
        const searchboxInputOption = document.createElement("div");
        searchboxInputOption.classList.add("searchbox-input-option");
        searchboxInputOption.textContent = "No address found";
        searchboxInputOptions.appendChild(searchboxInputOption);
    }
    else {
        options.forEach(option => {
            const searchboxInputOption = document.createElement("div");
            searchboxInputOption.classList.add("searchbox-input-option");
            searchboxInputOption.textContent = option.display_name;

            searchboxInputOption.addEventListener("click", async (e) => {
                const searchboxInput = document.getElementById("searchbox-input");
                searchboxInput.value = e.target.textContent;
                searchboxInputOptions.classList.remove("expanded");
                searchbox.classList.remove("expanded");
                addMarker(map, option.lat, option.lng);
                const dangerLevel = await getDangerLevel(option.lat, option.lng);

                lastAddress = option.display_name;
                lastDangerLevel = dangerLevel;

                await displayDangerInfo(option.display_name, dangerLevel);
                map.setView([option.lat, option.lng], 16);
            });
            searchboxInputOptions.appendChild(searchboxInputOption);
        });
    }
}

async function fetchAddressOptions(address) {
    const URL = `https://nominatim.openstreetmap.org/search?format=json&limit=5&country=Romania&city=Bucuresti&street=${address}`;
    const rawResponse = await fetch(URL);
    const response = await rawResponse.json();
    const addressOptions = response.map(addressOption => ({
        display_name: simplifyAddress(addressOption.display_name),
        lat: Number(addressOption.lat),
        lng: Number(addressOption.lon)
    }));
    const uniqueAddressOptions = getUniqueAddresses(addressOptions);
    return uniqueAddressOptions;
}

function simplifyAddress(address) {
    let removeSubstr;
    if (address.includes("Ilfov")) {
        removeSubstr = ", Bucharest, Ilfov, ######, Romania";
    }
    else {
        removeSubstr = ", Bucharest, ######, Romania";
    }
    let newAddress = address.slice(0, -(removeSubstr.length));
    return newAddress;
}

function getUniqueAddresses(addresses) {
    return addresses.filter((address, index, self) =>
        index === self.findIndex((t) => t.display_name === address.display_name)
    );
}

async function displayDangerInfo(address, dangerLevel) {
    // Reset bookmark state to unfilled(regular)
    const bookmark = document.querySelector(".fa-bookmark");
    if (bookmark.classList.contains("fa-solid")) {
        bookmark.classList.toggle("fa-regular");
        bookmark.classList.toggle("fa-solid");
    }

    // Retrieve bookmark state from the database and update it on the page
    if (lastAddress) {
        const addressExistsRaw = await fetch(`/saved-locations/${lastAddress}`);
        const addressExists = await addressExistsRaw.json();
        if (addressExists) {
            bookmark.classList.toggle("fa-regular");
            bookmark.classList.toggle("fa-solid");
        }
    }

    const addressDiv = document.getElementById("address");
    const dangerLevelDiv = document.getElementById("danger-level");

    // Fill divs with address and danger level information
    addressDiv.textContent = address;
    if (dangerLevel[2] > 250) {
        bookmark.classList.add("hidden");
        dangerLevelDiv.style.backgroundColor = "#cacaca";
        dangerLevelDiv.textContent = "No Data";
    }
    else {
        bookmark.classList.remove("hidden");
        dangerLevelDiv.textContent = "";
        dangerLevelDiv.style.backgroundColor = `rgb(${dangerLevel[0]}, ${dangerLevel[1]}, ${dangerLevel[2]})`;
    }

    // Display danger info
    const dangerInfo = document.getElementById("danger-info");
    if (!dangerInfo.classList.contains("expanded")) {
        dangerInfo.classList.toggle("expanded");
    }

    // For mobile, swipe up the danger info if it is hidden
    dangerInfo.classList.remove("hidden");
}

export function attachSearchHandler(map) {
    const searchboxInput = document.getElementById("searchbox-input");
    searchboxInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            const address = searchboxInput.value;
            await handleSearch(map, address);
        }
    });
}

export function attachXmarkClickHandler() {
    // Add event listener for xmark to clear input's text
    const xmark = document.querySelector("#searchbox .fa-xmark");
    xmark.addEventListener("click", () => {
        const searchboxInput = document.getElementById("searchbox-input");
        searchboxInput.value = "";
    });
}