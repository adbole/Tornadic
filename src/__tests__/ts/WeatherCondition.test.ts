import * as Conditions from "svgs/conditions";

import type { Intesity, WeatherConditionType } from "ts/WeatherCondition";
import WeatherCondition from "ts/WeatherCondition";

//[Weathercode, intensity, condition, icon day, icon night]
const valueExpected: [
    number,
    Intesity,
    WeatherConditionType,
    React.ComponentType,
    React.ComponentType,
][] = [
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

test.each(valueExpected)(
    "%i -> %s %s with icons %o and %o",
    (code, intensity, type, dayIcon, nightIcon) => {
        const dayCondition = new WeatherCondition(code, true);
        const nightCondition = new WeatherCondition(code, false);

        expect.soft(dayCondition.intensity).toBe(intensity);
        expect.soft(dayCondition.type).toBe(type);
        expect.soft(dayCondition.icon.name).toBe(dayIcon.name);

        expect.soft(nightCondition.intensity).toBe(dayCondition.intensity);
        expect.soft(nightCondition.type).toBe(dayCondition.type);
        expect.soft(nightCondition.icon.name).toBe(nightIcon.name);
    }
);
