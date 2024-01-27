import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import {
    getLowHigh,
    trunc,
} from "./Helpers";


mockDate();

test("trunc truncates a value to at most 2 decimal places and rounds if needed", () => {
    //Basic
    expect.soft(trunc(1.234)).toBe(1.23);
    expect.soft(trunc(1.2345)).toBe(1.23);
    expect.soft(trunc(1)).toBe(1);
    expect.soft(trunc(0.23)).toBe(0.23);

    //Edge Cases
    expect.soft(trunc(69.1)).toBe(69.1);
    expect.soft(trunc(1.1)).toBe(1.1);
    expect.soft(trunc(1.005)).toBe(1.01);
});

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
