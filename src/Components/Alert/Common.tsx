import { NWSAlert } from "Contexts/WeatherContext/index.types";

import * as TimeConversion from "ts/TimeConversion";

enum AlertType {
    WARNING,
    ADVISORY,
    STATEMENT,
    WATCH,
    NONE
}

/**
 * Takes an alert and returns the CSS class that represents it in the Alert component and Radar
 * @param alert The alert to get the CSS class of
 * @returns A CSS class for styling
 */
export function getAlertCSSClass(alert: NWSAlert) {
    //Use reverse mapping to get alert name for CSS class.
    return "alert-" + AlertType[getAlertType(alert)].toLowerCase();
}

/**
 * Takes an alert and determines based on its name and status what its priority should be
 * @param alert The alert to get the priority of
 * @returns A number where the lower it is the higher the priority
 */
export function determineAlertPriority(alert: NWSAlert): number {
    //AlertTypes take advantage of the automatic numeric initialization for priority i.e., warnings have highest priority.
    return getNamePriority(alert) + getAlertType(alert);
}

/**
 * Takes an alert and extracts its event name to determine what its priority without its type is.
 * @param alert The alert to get the event name of.
 * @returns A number where the lower it is the higher the priority
 */
function getNamePriority(alert: NWSAlert): number {
    const lastSpace = alert.properties.event.lastIndexOf(" ");
    const name = alert.properties.event.slice(0, lastSpace).toLowerCase();

    switch(name) {
        case "tsunami": return 1;
        case "tornado": return 2;
        case "extreme wind": return 3;
        case "severe thunderstorm": return 4;
        case "flash flood": return 5;
        case "severe weather": return 6;
        case "shelter in place": return 7;
        case "evacuation immediate": return 8;
        case "civil danger": return 9;
        case "nuclear power plant": return 10;
        case "radiological hazard": return 11;
        case "hazardous materials": return 12;
        case "fire": return 13;
        case "civil emergency message": return 14;
        case "law enforcement": return 15;
        case "storm surge": return 16;
        case "hurricane force wind": return 17;
        case "hurricane": return 18;
        case "typhoon": return 19;
        case "special marine": return 20;
        case "blizzard": return 21;
        case "snow squall": return 22;
        case "ice storm": return 23;
        case "winter storm": return 24;
        case "high wind": return 25;
        case "tropical storm": return 26;
        case "storm": return 27;
        case "avalanche": return 28;
        case "earthquake": return 29;
        case "volcano": return 30;
        case "ashfall": return 31;
        case "coastal flood": return 32;
        case "lakeshore flood": return 33;
        case "flood": return 34;
        case "high surf": return 35;
        case "dust storm": return 36;
        case "blowing dust": return 37;
        case "lake effect snow": return 38;
        case "excessive heat": return 39;
        case "gale": return 40;
        case "wind chill": return 41;
        case "extreme cold": return 42;
        case "hard freeze": return 43;
        case "freeze": return 44;
        case "red flag": return 45;
        case "hurricane local": return 46;
        case "typhoon local": return 47;
        case "tropical storm local": return 48;
        case "tropical depression local": return 49;
        case "winter weather": return 50;
        case "heat": return 51;
        case "urban and small stream flood": return 52;
        case "small stream flood": return 53;
        case "arroyo and small stream flood": return 54;
        case "hydrologic": return 55;
        case "heavy freezing spray": return 56;
        case "dense fog": return 57;
        case "dense smoke": return 58;
        case "small craft": return 59;
        case "brisk wind": return 60;
        case "hazardous seas": return 61;
        case "dust": return 62;
        case "lake wind": return 63;
        case "wind": return 64;
        case "frost": return 65;
        case "freezing fog": return 66;
        case "freezing spray": return 67;
        case "low water": return 68;
        case "local area emergency": return 69;
        case "rip current": return 70;
        case "beach hazards": return 71;
        case "fire weather": return 72;
        case "extreme fire danger": return 73;
        case "911 telephone outage": return 74;
        case "special weather": return 75;
        case "marine weather": return 76;
        case "air quality alert": return 77;
        case "air stagnation": return 78;
        case "hazardous weather outlook": return 79;
        case "hydrologic outlook": return 80;
        case "short term forecast": return 81;
        case "administrative message": return 82;
        case "test": return 83;
        case "child abduction emergency": return 84;
        case "blue alert": return 85;
        default: return 100;
    }
}

/**
 * Takes an alert and tries to see what kind of alert it is and returns it as an AlertType
 * @param alert The alert to get the color of.
 */
function getAlertType(alert: NWSAlert): AlertType {
    const lastSpace = alert.properties.event.lastIndexOf(" ");
    const type = alert.properties.event.slice(lastSpace + 1).toLowerCase();

    switch(type) {
        case "warning":   return AlertType.WARNING;
        case "watch":     return AlertType.WATCH;
        case "advisory":  return AlertType.ADVISORY;
        case "statement": return AlertType.STATEMENT;
        default:          return AlertType.NONE;
    }
}

export const convertTime = (a: string) => TimeConversion.getTimeFormatted(a, TimeConversion.TimeFormat.DateTime);