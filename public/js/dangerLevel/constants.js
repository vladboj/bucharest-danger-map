// Define earth's radius
export const EARTH_RADIUS = 6371;

// Define center of bucharest by latitude and longitude
export const CENTER = { lat: 44.432695, lng: 26.104046 };

// Latitude and longitude of Bucharest's most extreme points, used to compute
// the coordinates of the most extreme points
// const NORTH = { lat: 44.541284, lng: 26.099258 };
// const EAST = { lat: 44.432378, lng: 26.225469 };
// const SOUTH = { lat: 44.334587, lng: 26.151967 };
// const WEST = { lat: 44.44067, lng: 25.966669 };


// Axes extremities precomputed using the <convertToCoordinates> function
// and the above mentioned latitudes and longitudes
export const AXES_EXTREMITIES = {
    xMin: -10.292034096252307,
    xMax: 10.255130312980972,
    yMin: -11.683918112104092,
    yMax: 11.299739640546083
};

// Define the width and height of the image
export const IMG = { width: 1175, height: 1302 };