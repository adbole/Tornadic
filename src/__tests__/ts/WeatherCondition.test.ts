import * as Conditions from "svgs/conditions";

import type { Intesity, WeatherConditionType } from "ts/WeatherCondition";
import WeatherCondition from "ts/WeatherCondition";


//[Weathercode, intensity, condition, icon day, icon night]
const valueExpected: [number, Intesity, WeatherConditionType, React.ComponentType, React.ComponentType][] = [
    [0, "", "Clear", Conditions.Sun, Conditions.Moon],
    [1, "", "Mostly Clear", Conditions.CloudSun, Conditions.CloudMoon],
    [2, "", "Partly Cloudy", Conditions.Cloud, Conditions.Cloud],
    [3, "", "Overcast", Conditions.Clouds, Conditions.Clouds],
    [45, "", "Foggy", Conditions.Fog, Conditions.Fog],
    [48, "", "Foggy", Conditions.Fog, Conditions.Fog],
    [51, "Light", "Drizzle", Conditions.Drizzle, Conditions.Drizzle],
    [53, "Moderate", "Drizzle", Conditions.Drizzle, Conditions.Drizzle],
    [55, "Heavy", "Drizzle", Conditions.Drizzle, Conditions.Drizzle],
    [56, "Light", "Freezing Drizzle", Conditions.Drizzle, Conditions.Drizzle],
    [57, "Heavy", "Freezing Drizzle", Conditions.Drizzle, Conditions.Drizzle],
    [61, "Light", "Rain", Conditions.Rain, Conditions.Rain],
    [63, "Moderate", "Rain", Conditions.Rain, Conditions.Rain],
    [65, "Heavy", "Rain", Conditions.Rain, Conditions.Rain],
    [66, "Light", "Freezing Rain", Conditions.Rain, Conditions.Rain],
    [67, "Heavy", "Freezing Rain", Conditions.Rain, Conditions.Rain],
    [71, "Light", "Snow", Conditions.Snow, Conditions.Snow],
    [73, "Moderate", "Snow", Conditions.Snow, Conditions.Snow],
    [75, "Heavy", "Snow", Conditions.Snow, Conditions.Snow],
    [77, "", "Snow Grains", Conditions.Snow, Conditions.Snow],
    [80, "Light", "Rain Showers", Conditions.Rain, Conditions.Rain],
    [81, "Moderate", "Rain Showers", Conditions.Rain, Conditions.Rain],
    [82, "Heavy", "Rain Showers", Conditions.Rain, Conditions.Rain],
    [85, "Light", "Snow Showers", Conditions.Snow, Conditions.Snow],
    [86, "Heavy", "Snow Showers", Conditions.Snow, Conditions.Snow],
    [95, "", "Thunderstorms", Conditions.Lightning, Conditions.Lightning],
    [96, "", "Thunderstorms", Conditions.Lightning, Conditions.Lightning],
    [99, "", "Thunderstorms", Conditions.Lightning, Conditions.Lightning],
];

test("Every code is converted as expected with all props set accordingly", () => {
    const result = valueExpected.every(arr => {
        const dayCondition = new WeatherCondition(arr[0], true)
        const nightCondition = new WeatherCondition(arr[0], false)

        return dayCondition.intensity === arr[1] &&
               dayCondition.type === arr[2] &&
               dayCondition.icon.name === arr[3].name &&
               nightCondition.intensity === dayCondition.intensity &&
               nightCondition.type === dayCondition.type &&
               nightCondition.icon.name === arr[4].name
    })

    expect(result).toBe(true)
})

test.todo("Add background checks")