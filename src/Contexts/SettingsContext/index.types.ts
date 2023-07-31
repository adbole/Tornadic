export type UserSettings = {
    tempUnit: "fahrenheit" | "celsius"
    windspeed: "kmh" | "mph" | "kn"
    precipitation: "mm" | "inch"
    user_location: [number, number] | undefined
}