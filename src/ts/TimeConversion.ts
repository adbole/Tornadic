type TimeFormat = "weekday" | "hour" | "hourMinute" | "date" | "dateTime";

/**
 * Takes a string, number, or date and converts it to a readable string using the given format
 * @param value The value to be converted
 * @param format The format to convert to
 * @returns The readable string obtained from conversion
 */
export default function getTimeFormatted(value: string | number | Date, format: TimeFormat) {
    if (format === "weekday" || format === "date") {
        return new Date(value).toLocaleDateString("en-US", getFormatOptions(format));
    }
    return new Date(value).toLocaleString("en-US", getFormatOptions(format));
}

function getFormatOptions(format: TimeFormat): Intl.DateTimeFormatOptions {
    switch (format) {
        case "weekday":
            return { weekday: "short", timeZone: "UTC" };
        case "hour":
            return { hour: "numeric", hour12: true };
        case "hourMinute":
            return { hour: "numeric", minute: "numeric", hour12: true };
        case "date":
            return { weekday: "long", month: "short", day: "numeric" };
        case "dateTime":
            return {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour12: true,
                hour: "numeric",
                minute: "numeric",
                timeZoneName: "short",
            };
    }
}
