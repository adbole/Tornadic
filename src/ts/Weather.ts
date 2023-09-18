/**
 * The Weather class takes forecast, airquality, point, and alert data to provide access to said data along with helpful methods to act on the data
 */

import getTimeFormatted from "ts/TimeConversion";

import type { WeatherConditionType } from "./WeatherCondition";
import WeatherCondition from "./WeatherCondition";


type BaseInfo = Readonly<{
    conditionInfo: WeatherCondition;
    precipitation_probability: number;
    has_chance_of_rain: boolean;
}>;

export type HourInfo = Readonly<{
    time: string;
    temperature: number;
}> &
    BaseInfo;

export type DayInfo = Readonly<{
    day: string;
    temperature_low: number;
    temperature_high: number;
}> &
    BaseInfo;

export type CombinedHourly = Forecast["hourly"] & Omit<AirQuality["hourly"], "time">;

/**
 * The WeatherData class takes forecast, airquality and point data to provide access to
 * said data along with helpful methods to act on the data.
 * This class is automatically initialized by WeatherContext and is used as the context throughout the application.
 */
export default class Weather {
    readonly hourLength: number;
    readonly dayLength: number;
    readonly nowIndex: number;

    private readonly forecast: Readonly<Forecast>;
    private readonly airQuality: Readonly<AirQuality>;

    constructor(forecast: Forecast, airQuality: AirQuality, settings: UserSettings) {
        this.hourLength = forecast.hourly.time.length;
        this.dayLength = forecast.daily.time.length;

        this.forecast = this.configureForecast(forecast, settings);
        this.airQuality = airQuality;

        this.nowIndex = this.forecast.hourly.time.indexOf(this.forecast.current_weather.time);
    }

    private configureForecast(forecast: Forecast, settings: UserSettings) {
        const visibilityDivisor = settings.precipitation === "inch" ? 5280 : 1000;

        //All data point arrays have the same length, so one loop is sufficient
        for (let i = 0; i < forecast.hourly.time.length; ++i) {
            //Convert units
            forecast.hourly.surface_pressure[i] /= 33.864;
            forecast.hourly.visibility[i] /= visibilityDivisor;
        }

        const units = forecast.hourly_units;

        units.surface_pressure = "inHG";
        units.visibility = settings.precipitation === "inch" ? "mi" : "km";
        units.precipitation = settings.precipitation === "inch" ? '"' : "mm";

        //Other data points have units that are inconsistent with app unit style
        units.apparent_temperature = units.temperature_2m = units.dewpoint_2m = "°";
        units.windspeed_10m = units.windgusts_10m = settings.windspeed;

        return forecast;
    }

    isDay(timeIndex: number = this.nowIndex) {
        return Boolean(this.forecast.hourly.is_day[timeIndex]);
    }

    /**
     * Open-Meteo provides some data through current_weather, but it is incomplete. This method
     * will take other data using nowIndex and combine it to provide a better Now.
     */
    getNow(): {
        readonly conditionInfo: WeatherCondition;
        readonly temperature: string;
        readonly feelsLike: string;
    } {
        return {
            conditionInfo: new WeatherCondition(this.getForecast("weathercode"), this.isDay()),
            temperature: this.getForecast("temperature_2m").toFixed(0),
            feelsLike: this.getForecast("apparent_temperature").toFixed(0),
        };
    }

    /**
     * Gets 48 hours of future values
     */
    *getFutureValues(): Generator<HourInfo> {
        const start = this.nowIndex + 1

        for (let i = start; i < start + 48; ++i) {
            const conditionInfo = new WeatherCondition(
                this.getForecast("weathercode", i),
                this.isDay(i)
            );
            const precipitation_probability = this.getForecast("precipitation_probability", i);

            yield {
                time: this.getForecast("time", i),
                conditionInfo,
                temperature: Math.round(this.getForecast("temperature_2m", i)),
                precipitation_probability,
                has_chance_of_rain: Weather.hasChanceOfRain(
                    conditionInfo.type,
                    precipitation_probability
                ),
            };
        }
    }

    *getDailyValues(): Generator<DayInfo> {
        for (let i = 0; i < this.getAllDays("time").length; ++i) {
            const isDay = i === 0 ? this.isDay() : true;

            const weatherCode =
                i === 0 ? this.getForecast("weathercode") : this.getDay("weathercode", i);
            const conditionInfo = new WeatherCondition(weatherCode, isDay);
            const precipitation_probability = this.getDay("precipitation_probability_max", i);

            yield {
                day: i === 0 ? "Now" : getTimeFormatted(this.getDay("time", i), "weekday"),
                conditionInfo,
                temperature_low: Math.round(this.getDay("temperature_2m_min", i)),
                temperature_high: Math.round(this.getDay("temperature_2m_max", i)),
                precipitation_probability,
                has_chance_of_rain: Weather.hasChanceOfRain(
                    conditionInfo.type,
                    precipitation_probability
                ),
            };
        }
    }

    getForecast<K extends keyof CombinedHourly>(
        prop: K,
        hour: number = this.nowIndex
    ): CombinedHourly[K][number] {
        if (prop in this.forecast.hourly) {
            const key = prop as keyof Forecast["hourly"];
            return this.forecast.hourly[key][hour];
        }

        const key = prop as keyof AirQuality["hourly"];
        return this.airQuality.hourly[key][hour];
    }

    getForecastUnit(prop: keyof CombinedHourly): string {
        if (prop in this.forecast.hourly_units) {
            const key = prop as keyof Forecast["hourly_units"];
            return this.forecast.hourly_units[key];
        }

        return "";
    }

    getDay<K extends keyof Forecast["daily"]>(
        prop: K,
        day: number = 0
    ): Forecast["daily"][K][number] {
        return this.forecast.daily[prop][day];
    }

    getAllForecast<K extends keyof CombinedHourly>(prop: K): CombinedHourly[K] {
        if (prop in this.forecast.hourly) {
            const key = prop as keyof Forecast["hourly"];
            return this.forecast.hourly[key] as CombinedHourly[K];
        }

        const key = prop as keyof AirQuality["hourly"];
        return this.airQuality.hourly[key] as CombinedHourly[K];
    }

    getAllDays<K extends keyof Forecast["daily"]>(prop: K): Forecast["daily"][K] {
        return this.forecast.daily[prop];
    }

    private static hasChanceOfRain(condition: WeatherConditionType, precip_prop: number) {
        switch (condition) {
            case "Clear":
            case "Mostly Clear":
            case "Partly Cloudy":
            case "Overcast":
                return false;
            default:
                return precip_prop >= 10;
        }
    }
}
