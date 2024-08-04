import * as Constants from "../dangerLevel/constants.js";

function createMap() {
    return L
        .map('map', { zoomControl: false })
        .setView([Constants.CENTER.lat, Constants.CENTER.lng], 12);
}

function addTileLayer(map) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

export function initMap() {
    const map = createMap();
    addTileLayer(map);
    return map;
}

// Used for keeping track of the previous added marker and deleting it on new search
let prevMarker = null;

export function addMarker(map, lat, lng) {
    removePreviousMarker(map);

    const newMarker = L.marker([lat, lng]);
    map.addLayer(newMarker);
    prevMarker = newMarker;
}

function removePreviousMarker(map) {
    if (prevMarker !== null) {
        map.removeLayer(prevMarker);
    }
}