//Provides methods to normalize a value between to values to be between 0 and 1
export class Normalize {
    //Normalizes a value to be between 0 and 1 given it and the minimum and maximum values possible
    static Decimal(x: number, min: number, max: number) {
        return (x - min)/(max-min);
    }

    //Converts Decimal calculation to a percentage
    static Percent(x: number, min: number, max: number) {
        return Normalize.Decimal(x, min, max) * 100;
    }
}

export class TimeConverter {
    /**
     * Takes a string, number, or date and converts it to a readable string in the format weekday-short
     * @param value The value to be converted
     * @returns The readable string obtained from conversion
     */
    static GetDayOfWeek(value: string | number| Date) {
        return new Date(value).toLocaleDateString("en-US", {weekday: "short", timeZone: "UTC"});
    }

    /**
     * Takes a string, number, or date and converts it to a readable string in the format hour AM/PM
     * @param value The value to be converted
     * @returns The readable string obtained from conversion
     */
    static GetHourOfDay(value: string | number| Date) {
        return new Date(value).toLocaleTimeString("en-us", {hour: "numeric", hour12: true});
    }

    /**
     * Takes a string, number, or date and converts it to a readable string in the format hour:minute AM/PM
     * @param value The value to be converted
     * @returns The readable string obtained from conversion
     */
    static GetHourMinuteOfDay(value: string | number| Date) {
        return new Date(value).toLocaleTimeString("en-us", {hour: "numeric", minute: "numeric", hour12: true});
    }

    /**
     * Takes a string, number, or date and converts it to a readable string in the format weekday, month, day, hour:minute AM/PM timezone
     * @param value The value to be converted
     * @returns The readable string obtained from conversion
     */
    static GetDateString(value: string | number| Date) {
        return new Date(value).toLocaleTimeString("en-us", {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"});
    }
}

/**
 * Makes a request to the given url (supports strings and URL objects) and an error message. Await to get data
*/
export async function FetchData<T>(url: string | URL, onErrorMessage: string) {
    return fetch(url)
           .then((response) => response.ok ? response.json() : Promise.reject(onErrorMessage))
           .then((data: T) => data)
           .catch((error) => { 
                console.error(error); 
                return null;
            });
}