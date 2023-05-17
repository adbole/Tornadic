import React from "react";

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

export namespace TimeConverter {
    export enum TimeFormat {
        Weekday,
        Hour,
        HourMinute,
        Date,
        DateTime
    }

    /**
     * Takes a string, number, or date and converts it to a readable string using the given format
     * @param value The value to be converted
     * @param format The format to convert to
     * @returns The readable string obtained from conversion
     */
    export function GetTimeFormatted(value: string | number | Date, format: TimeFormat) {
        if(format === TimeFormat.Weekday || format === TimeFormat.Date) {
            return new Date(value).toLocaleDateString("en-US", GetFormatOptions(format));
        }
        else {
            return new Date(value).toLocaleString("en-US", GetFormatOptions(format));
        }
    }

    function GetFormatOptions(format: TimeFormat): Intl.DateTimeFormatOptions {
        switch(format) {
            case TimeFormat.Weekday: return {weekday: "short", timeZone: "UTC"};
            case TimeFormat.Hour: return {hour: "numeric", hour12: true};
            case TimeFormat.HourMinute: return {hour: "numeric", minute: "numeric", hour12: true};
            case TimeFormat.Date: return {weekday:"long", month:"short", day:"numeric"};
            case TimeFormat.DateTime: return {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"};
            default: return {};
        }
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

//Helper method to ensure that a string matches a property on a type 
export const nameof = <T,>(name: Extract<keyof T, string>): string => name;

export const useMountedEffect = (func: React.EffectCallback, deps?: React.DependencyList | undefined) => {
    const ready = React.useRef(false);

    React.useEffect(() => {
        if(!ready.current) {
            ready.current = true;
            return;
        };

        return func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};