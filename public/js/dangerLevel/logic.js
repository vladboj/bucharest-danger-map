import * as Constants from "./constants.js";

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function convertToCoordinates(lat, lng) {
    const avgLat = (lat + Constants.CENTER.lat) / 2;
    const cosLat = Math.cos(degreesToRadians(avgLat));
    let coordinates = {};
    coordinates.x = degreesToRadians(lng - Constants.CENTER.lng) * (Constants.EARTH_RADIUS * cosLat);
    coordinates.y = degreesToRadians(lat - Constants.CENTER.lat) * Constants.EARTH_RADIUS;
    return coordinates;
}

function getRelativePositions(coordinates) {
    let relativePositions = {};
    relativePositions.rel_x = (coordinates.x - Constants.AXES_EXTREMITIES.xMin) /
        (Constants.AXES_EXTREMITIES.xMax - Constants.AXES_EXTREMITIES.xMin);
    relativePositions.rel_y = (coordinates.y - Constants.AXES_EXTREMITIES.yMin) /
        (Constants.AXES_EXTREMITIES.yMax - Constants.AXES_EXTREMITIES.yMin);
    return relativePositions;
}

function convertToMatrixIndices(relativePositions) {
    let matrixIndices = {};
    matrixIndices.i = Math.floor((1 - relativePositions.rel_y) * Constants.IMG.height);
    matrixIndices.j = Math.floor(relativePositions.rel_x * Constants.IMG.width);
    return matrixIndices;
}

function convertToArrayIndex(matrixIndices) {
    return (matrixIndices.i * Constants.IMG.width + matrixIndices.j) * 4;
}

async function readPixelsArray() {
    const jsonPixelsArray = await fetch("/js/dangerLevel/pixels.json");
    const pixelsArray = await jsonPixelsArray.json();
    return pixelsArray;
}

function extractColor(pixelsArray, index) {
    return pixelsArray.slice(index, index + 3);
}

export async function getDangerLevel(lat, lng) {
    const coordinates = convertToCoordinates(lat, lng);
    const relativePositions = getRelativePositions(coordinates);
    const matrixIndices = convertToMatrixIndices(relativePositions);
    const arrayIndex = convertToArrayIndex(matrixIndices);
    const pixelsArray = await readPixelsArray();
    const dangerLevel = extractColor(pixelsArray, arrayIndex);
    return dangerLevel;
}