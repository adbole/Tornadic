import airQualityApiOpenMeteo from "__tests__/__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "__tests__/__mocks__/api.open-meteo";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";
import type { WeatherConditionType } from "ts/WeatherCondition";

//NOW INDEX FOR MOCK IS 21
const NOW_INDEX = 21

const weatherTest = test.extend({ weather: new Weather(apiOpenMeteo, airQualityApiOpenMeteo, DEFAULTS.userSettings) })


weatherTest("isDay returns the correct day value", ({ weather }) => {
    expect(weather.isDay()).toEqual(Boolean(apiOpenMeteo.current_weather.is_day))
})

weatherTest("getNow returns an object of values representing now", ({ weather }) => {
    const now = weather.getNow()

    expect.soft(now.conditionInfo.type).toEqual<WeatherConditionType>("Partly Cloudy")
    expect.soft(now.feelsLike).toEqual(apiOpenMeteo.hourly.apparent_temperature[NOW_INDEX].toFixed(0))
    expect.soft(now.temperature).toEqual(apiOpenMeteo.hourly.temperature_2m[NOW_INDEX].toFixed(0))
})

weatherTest("getFutureValues returns a generator of 48 values starting after the nowIndex", ({ weather }) => {
    const arr = [...weather.getFutureValues()]

    expect.soft(arr).toHaveLength(48)
    expect.soft(arr[0].time).toEqual(apiOpenMeteo.hourly.time[NOW_INDEX + 1])
    expect.soft(arr[arr.length - 1].time).toEqual(apiOpenMeteo.hourly.time[NOW_INDEX + 48])
})

weatherTest("getDailyValues returns a generator of a 7 day forecast", ({ weather }) => {
    const arr = [...weather.getDailyValues()]

    expect.soft(arr).toHaveLength(7)    
    expect.soft(arr[0].day).toEqual("Now")
})

describe("getForecast", () => {
    weatherTest("Given Forecast, Airquality and Settings all values are valid and available", ({ weather }) => {
        const forecastResult = Object.entries(apiOpenMeteo.hourly).every(([key, arr]) => 
            arr.every((value, index) => value === weather.getForecast(key as any, index))
        )

        const airQualityResult = airQualityApiOpenMeteo.hourly.us_aqi.every((value, index) => 
            value === weather.getForecast("us_aqi", index)
        )
    
        expect(forecastResult && airQualityResult).toBe(true)
    })

    weatherTest("uses nowIndex", ({ weather }) => {
        expect(weather.getForecast("time")).toEqual(apiOpenMeteo.current_weather.time)
    })
})

weatherTest("getForecastUnit returns the proper unit foreach value", ({ weather }) => {
    const forecastResult = Object.entries(apiOpenMeteo.hourly_units).every(([key, value]) => 
        value === weather.getForecastUnit(key as any)
    )

    expect.soft(forecastResult).toBe(true)
    expect.soft(weather.getForecastUnit("us_aqi")).toBe("")
})

test.todo("getDay")
test.todo("getAllForecast")
test.todo("getAllDays")
test.todo("hasChanceOfRain")