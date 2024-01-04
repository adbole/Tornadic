//Provides methods to normalize a value between to values to be between 0 and 1\w+:
export class Normalize {
    //Normalizes a value to be between 0 and 1 given it and the minimum and maximum values possible
    static Decimal(x: number, min: number, max: number) {
        x = Math.max(Math.min(x, max), min);

        return (x - min) / (max - min);
    }

    //Converts Decimal calculation to a percentage
    static Percent(x: number, min: number, max: number) {
        return Normalize.Decimal(x, min, max) * 100;
    }
}

export type AQLevel =
    | "Good"
    | "Moderate"
    | "Unhealthy*"
    | "Unhealthy"
    | "Very Unhealthy"
    | "Hazardous";

export function get_aq(aq: number): AQLevel {
    if (aq <= 50) return "Good";
    else if (aq <= 100) return "Moderate";
    else if (aq <= 150) return "Unhealthy*"; //Unhealthy for Sensitive Individuals
    else if (aq <= 200) return "Unhealthy";
    else if (aq <= 300) return "Very Unhealthy";
    return "Hazardous";
}

export function getAQMaxValue(aq: AQLevel): number {
    switch (aq) {
        case "Good": return 50;
        case "Moderate": return 100;
        case "Unhealthy*": return 150;
        case "Unhealthy": return 200;
        case "Very Unhealthy": return 300;
        case "Hazardous": return 500;
    }
}

export type UVLevel = 
    | "Low" 
    | "Moderate" 
    | "High" 
    | "Very High" 
    | "Extreme";

export function get_uv(uv: number): UVLevel {
    if (uv <= 2) return "Low";
    else if (uv <= 5) return "Moderate";
    else if (uv <= 7) return "High";
    else if (uv <= 10) return "Very High";
    return "Extreme";
}

export function getUVMaxValue(uv: UVLevel): number {
    switch (uv) {
        case "Low": return 2;
        case "Moderate": return 5;
        case "High": return 7;
        case "Very High": return 10;
        case "Extreme": return 11;
    }
}

//Converts the given Fahrenheit temperature to a hsl color
export function toHSL(temp: number, unit: UserSettings["tempUnit"]) {
    const max = unit === "fahrenheit" ? 120 : 45;

    return `hsl(${250 * (1 - Normalize.Decimal(temp, 0, max))}deg, 100%, 50%)`;
}

//Throws an error. For use in expressions where throw isn't allowed.
export const throwError = (msg: string) => {
    throw new Error(msg);
};

//Helper method to ensure that a string matches a property on a type
export const nameof = <T>(name: Extract<keyof T, string>): string => name;
