import airQualityApiOpenMeteo from "__tests__/__mocks__/air-quality-api.open-meteo";
import apiOpenMeteo from "__tests__/__mocks__/api.open-meteo";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";


const weatherTest = test.extend({ weather: new Weather(apiOpenMeteo, airQualityApiOpenMeteo, DEFAULTS.userSettings) })

weatherTest("Given Forecast, Airquality and Settings all values are valid and available", ({ weather }) => {
    const result = Object.entries(apiOpenMeteo.hourly).every(([key, arr]) => 
        arr.every((value, index) => value === weather.getForecast(key as any, index))
    )

    expect(result).toBe(true)
})

test.todo("isDay")
test.todo("getNow")
test.todo("getFutureValues")
test.todo("getDailyValues")
test.todo("getForecastUnit")
test.todo("getDay")
test.todo("getAllForecast")
test.todo("getAllDays")
test.todo("hasChanceOfRain")