/**
 * Physics constants and conversion utilities for the gravity simulator
 */

// Constants
export const GRAVITATIONAL_CONSTANT = 6.67430e-11; // m^3 kg^-1 s^-2
export const SPEED_OF_LIGHT = 299792458; // m/s

// Astronomical distances
export const ASTRONOMICAL_UNIT = 149.6e9; // meters (Earth-Sun distance)
export const LIGHT_YEAR = 9.461e15; // meters
export const PARSEC = 3.086e16; // meters

// Celestial masses (kg)
export const SOLAR_MASS = 1.989e30;
export const EARTH_MASS = 5.972e24;
export const JUPITER_MASS = 1.898e27;
export const MOON_MASS = 7.342e22;

// Celestial radii (meters)
export const SOLAR_RADIUS = 696340000;
export const EARTH_RADIUS = 6371000;
export const JUPITER_RADIUS = 69911000;
export const MOON_RADIUS = 1737400;

/**
 * Scales a distance value for display purposes
 * Astronomical distances are too large to visualize directly
 *
 * @param {Number} distance - Distance in meters
 * @returns {Number} - Scaled distance for visualization
 */
export function scaleDistance(distance) {
    return distance * 1e-9; // Scale down by a factor of 1 billion
}

/**
 * Scales a velocity value for simulation purposes
 *
 * @param {Number} velocity - Velocity in m/s
 * @returns {Number} - Scaled velocity for simulation
 */
export function scaleVelocity(velocity) {
    return velocity; // No scaling by default, adjust as needed
}

/**
 * Formats a large number in scientific notation for display
 *
 * @param {Number} number - Number to format
 * @param {Number} decimals - Number of decimal places
 * @returns {String} - Formatted number string
 */
export function formatScientific(number, decimals = 2) {
    return number.toExponential(decimals);
}

/**
 * Converts between different units of measurement
 *
 * @param {Number} value - Value to convert
 * @param {String} fromUnit - Unit to convert from
 * @param {String} toUnit - Unit to convert to
 * @returns {Number} - Converted value
 */
export function convertUnits(value, fromUnit, toUnit) {
    // Define conversion factors relative to base units
    const distanceFactors = {
        'm': 1,
        'km': 1e3,
        'au': ASTRONOMICAL_UNIT,
        'ly': LIGHT_YEAR,
        'pc': PARSEC
    };

    const massFactors = {
        'kg': 1,
        'earthMass': EARTH_MASS,
        'solarMass': SOLAR_MASS
    };

    // Determine which conversion to use
    if (distanceFactors[fromUnit] && distanceFactors[toUnit]) {
        return value * (distanceFactors[fromUnit] / distanceFactors[toUnit]);
    } else if (massFactors[fromUnit] && massFactors[toUnit]) {
        return value * (massFactors[fromUnit] / massFactors[toUnit]);
    } else {
        throw new Error(`Cannot convert between ${fromUnit} and ${toUnit}`);
    }
}