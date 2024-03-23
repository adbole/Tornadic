import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { getLowHigh } from "./Helpers";


mockDate();

test("getLowHigh returns the low and high of a given day", () => {
    const { weather } = useWeather();
    expect.soft(getLowHigh(weather, "temperature_2m", 0)).toBe("L: 63.7° H: 72.4°");
    expect.soft(getLowHigh(weather, "temperature_2m", 1)).toBe("L: 58.7° H: 79.8°");
    expect.soft(getLowHigh(weather, "temperature_2m", 2)).toBe("L: 62.5° H: 69.1°");
    expect.soft(getLowHigh(weather, "temperature_2m", 3)).toBe("L: 62° H: 82.5°");
});

test("getLowHigh returns undefined if the range is undefined", () => {
    const { weather } = useWeather();
    expect.soft(getLowHigh(weather, "us_aqi", 7)).toBe(undefined);
});
