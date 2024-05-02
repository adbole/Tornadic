import { airquality, forecast } from "@test-mocks";
import { mockDate } from "@test-utils";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";
import WeatherCondition from "ts/WeatherCondition";

//NOW INDEX FOR MOCK IS 21
const NOW_INDEX = 21;

//These objects will be modified by weather, this makes testing easier as it ensures
//the methods are accessing the objects as expected since the referenced values should be the same.
//Exact values don't matter for these tests, only conversion tests use unique objects.
const forecastObj = forecast();
const airqualityObj = airquality();

const weatherTest = test.extend<{
    weather: Weather;
}>({
    weather: async ({ task }, use) => {
        const weather = new Weather(forecastObj, airqualityObj, DEFAULTS.userSettings);

        await use(weather);
    },
});

mockDate();

weatherTest("isDay returns the correct day value", ({ weather }) => {
    expect(weather.isDay()).toEqual(Boolean(forecastObj.current_weather.is_day));
});

weatherTest(
    "getFutureValues returns a generator of 48 values starting after the nowIndex",
    ({ weather }) => {
        const arr = [...weather.getFutureValues()];

        expect.soft(arr).toHaveLength(48);
        expect.soft(arr[0].time).toEqual(forecastObj.hourly.time[NOW_INDEX + 1]);
        expect.soft(arr[arr.length - 1].time).toEqual(forecastObj.hourly.time[NOW_INDEX + 48]);
    }
);

weatherTest("getDailyValues returns a generator of a 7 day forecast", ({ weather }) => {
    const arr = [...weather.getDailyValues()];

    expect.soft(arr).toHaveLength(7);
    expect.soft(arr[0].day).toEqual("Now");
});

weatherTest("getWeatherCondition returns a WeatherCondition for the given hour", ({ weather }) => {
    const weatherCodes = forecastObj.hourly.weathercode.map(
        (code, i) => new WeatherCondition(code, Boolean(forecastObj.hourly.is_day[i]))
    );

    const allResult = weatherCodes.every((obj, i) => {
        const returned = weather.getWeatherCondition(i);

        return obj.type === returned.type && obj.intensity === returned.intensity;
    });

    const now = weatherCodes[NOW_INDEX];
    const returnedNow = weather.getWeatherCondition();

    const nowResult = now.type === returnedNow.type && now.intensity === returnedNow.intensity;

    expect(allResult && nowResult).toBe(true);
});

describe("getForecast", () => {
    weatherTest(
        "Given Forecast, Airquality and Settings all values are valid and available",
        ({ weather }) => {
            const forecastResult = Object.entries(forecastObj.hourly).every(([key, arr]) =>
                arr.every((value, index) => value === weather.getForecast(key as any, index))
            );

            const airQualityResult = airqualityObj.hourly.us_aqi.every(
                (value, index) => value === weather.getForecast("us_aqi", index)
            );

            expect(forecastResult && airQualityResult).toBe(true);
        }
    );

    weatherTest("uses nowIndex", ({ weather }) => {
        expect(weather.getForecast("time")).toEqual(forecastObj.current_weather.time);
    });
});

weatherTest("getForecastUnit returns the proper unit foreach value", ({ weather }) => {
    const forecastResult = Object.entries(forecastObj.hourly_units).every(
        ([key, value]) => value === weather.getForecastUnit(key as any)
    );

    expect.soft(forecastResult).toBe(true);
    expect.soft(weather.getForecastUnit("us_aqi")).toBe("");
});

weatherTest("getDay returns values for the daily prop", ({ weather }) => {
    const result = Object.entries(forecastObj.daily).every(([key, arr]) =>
        arr.every((value, index) => value === weather.getDay(key as any, index))
    );

    expect(result).toBe(true);
});

weatherTest("getAllForecast returns the array for each key", ({ weather }) => {
    const forecastResult = Object.entries(forecastObj.hourly).every(
        ([key, arr]) => arr === weather.getAllForecast(key as any)
    );

    const airQualityResult = airqualityObj.hourly.us_aqi === weather.getAllForecast("us_aqi");

    expect(forecastResult && airQualityResult).toBe(true);
});

weatherTest("getAllDays returns the array for each key", ({ weather }) => {
    const result = Object.entries(forecastObj.daily).every(
        ([key, arr]) => arr === weather.getAllDays(key as any)
    );

    expect(result).toBe(true);
});

test("hasChanceOfRain returns correct value for correct conditions", () => {
    /* @ts-ignore Typescript checks are disabled here to avoid private violation*/
    const hasChanceofRain = Weather.hasChanceOfRain;

    expect.soft(hasChanceofRain("Clear", 70)).toBe(false);
    expect.soft(hasChanceofRain("Mostly Clear", 70)).toBe(false);
    expect.soft(hasChanceofRain("Partly Cloudy", 70)).toBe(false);
    expect.soft(hasChanceofRain("Overcast", 70)).toBe(false);
    expect.soft(hasChanceofRain("Rain", 70)).toBe(true);
});

describe("configureForecast properly sets and converts units based on settings", () => {
    test("tempUnit", () => {
        const fahrenheit = new Weather(forecast(), airquality(), DEFAULTS.userSettings);
        const celsius = new Weather(forecast(), airquality(), {
            ...DEFAULTS.userSettings,
            tempUnit: "celsius",
        });

        const test = (unit: keyof Forecast["hourly"]) =>
            fahrenheit.getForecastUnit(unit) === celsius.getForecastUnit(unit) &&
            fahrenheit.getForecastUnit(unit) === "°";

        expect.soft(test("apparent_temperature")).toBe(true);
        expect.soft(test("temperature_2m")).toBe(true);
        expect.soft(test("dewpoint_2m")).toBe(true);
    });

    test("precipitation", () => {
        const inch = new Weather(forecast(), airquality(), DEFAULTS.userSettings);
        const mm = new Weather(forecast(), airquality(), {
            ...DEFAULTS.userSettings,
            precipitation: "mm",
        });

        expect.soft(inch.getForecastUnit("visibility") === "mi");
        expect.soft(inch.getForecastUnit("precipitation") === '"');

        expect.soft(mm.getForecastUnit("visibility") === "km");
        expect.soft(mm.getForecastUnit("precipitation") === "mm");
    });

    test("windspeed", () => {
        const mph = new Weather(forecast(), airquality(), DEFAULTS.userSettings);
        const kmh = new Weather(forecast(), airquality(), {
            ...DEFAULTS.userSettings,
            windspeed: "kmh",
        });
        const kn = new Weather(forecast(), airquality(), {
            ...DEFAULTS.userSettings,
            windspeed: "kn",
        });

        expect
            .soft(mph.getForecastUnit("windspeed_10m") === mph.getForecastUnit("windgusts_10m"))
            .toBe(true);
        expect
            .soft(kmh.getForecastUnit("windspeed_10m") === kmh.getForecastUnit("windgusts_10m"))
            .toBe(true);
        expect
            .soft(kn.getForecastUnit("windspeed_10m") === kn.getForecastUnit("windgusts_10m"))
            .toBe(true);

        expect
            .soft(mph.getForecastUnit("windspeed_10m") === kmh.getForecastUnit("windspeed_10m"))
            .toBe(false);
        expect
            .soft(mph.getForecastUnit("windspeed_10m") === kn.getForecastUnit("windspeed_10m"))
            .toBe(false);
    });

    test("visibililty is converted as expected", () => {
        const mi = new Weather(forecast(), airquality(), DEFAULTS.userSettings);
        const km = new Weather(forecast(), airquality(), {
            ...DEFAULTS.userSettings,
            precipitation: "mm",
        });

        const sourceForecast = forecast();

        expect
            .soft(
                sourceForecast.hourly.visibility.every(
                    (value, index) => value / 5280 === mi.getForecast("visibility", index)
                )
            )
            .toBe(true);

        expect
            .soft(
                sourceForecast.hourly.visibility.every(
                    (value, index) => value / 1000 === km.getForecast("visibility", index)
                )
            )
            .toBe(true);
    });

    test("surface_pressure is converted as expected", () => {
        const weather = new Weather(forecast(), airquality(), DEFAULTS.userSettings);
        const sourceForecast = forecast();

        expect(
            sourceForecast.hourly.surface_pressure.every(
                (value, index) => value / 33.864 === weather.getForecast("surface_pressure", index)
            )
        ).toBe(true);
    });
});
