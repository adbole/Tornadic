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
export function getTimeFormatted(value: string | number | Date, format: TimeFormat) {
    if(format === TimeFormat.Weekday || format === TimeFormat.Date) {
        return new Date(value).toLocaleDateString("en-US", getFormatOptions(format));
    }
    else {
        return new Date(value).toLocaleString("en-US", getFormatOptions(format));
    }
}

function getFormatOptions(format: TimeFormat): Intl.DateTimeFormatOptions {
    switch(format) {
        case TimeFormat.Weekday: return {weekday: "short", timeZone: "UTC"};
        case TimeFormat.Hour: return {hour: "numeric", hour12: true};
        case TimeFormat.HourMinute: return {hour: "numeric", minute: "numeric", hour12: true};
        case TimeFormat.Date: return {weekday:"long", month:"short", day:"numeric"};
        case TimeFormat.DateTime: return {weekday:"short", month:"short", day:"numeric", hour12:true, hour:"numeric", minute:"numeric", timeZoneName:"short"};
        default: return {};
    }
}