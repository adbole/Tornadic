/**
 * The WeatherData class takes forecast, airquality, point, and alert data to provide access to said data along with helpful methods to act on the data
 */

import { ReactNode } from "react";

import { AirQuality, Forecast, GridPoint, NWSAlert } from "Contexts/Weather/index.types";

import * as TimeConversion from "ts/TimeConversion";

import WeatherCondition, { WeatherConditionType } from "./WeatherCondition";

//#region Enum and type definitions
export type HazardInfo = Readonly<{
    id: string, //Used to distinguish the different gradient requirements in CSS
    title: string,
    titleIcon: ReactNode,
    value: number,
    min: number,
    max: number,
    message: string
}>

//Allows IsRaining to easily return values based on condition and precipitation despite if data is for hour or day
type BaseInfo = Readonly<{
    conditionInfo: WeatherCondition,
    precipitation_probability: number
}>

export type HourInfo = Readonly<{
    time: string,
    temperature: number
}> & BaseInfo

export type DayInfo = Readonly<{
    day: string
    temperature_low: number,
    temperature_high: number
}> & BaseInfo;
//#endregion Enum and type definitions

/**
 * The WeatherData class takes forecast, airquality, point, and alert data to provide access to said data along with helpful methods to act on the data.
 * This class is automatically initialized by WeatherContext and is used as the context throughout the application.
 */
export class WeatherData {
    readonly forecast: Readonly<Forecast>;
    readonly airQuality: Readonly<AirQuality>;
    readonly point: Readonly<GridPoint>;
    readonly alerts: Readonly<NWSAlert>[];

    constructor(forecast: Forecast, airQuality: AirQuality, point: GridPoint, alerts: NWSAlert[]) {
        this.forecast = forecast;
        this.airQuality = airQuality;
        this.point = point;
        this.alerts = alerts;
    }

    isDay(timeIndex: number) {
        return Boolean(this.forecast.hourly.is_day[timeIndex]);
    }

    /**
     * Open-Meteo provides some data through current_weather, but it is incomplete. This method
     * will take other data using forecast.nowIndex and combine it to provide a better Now.
     */
    getNow(): {
        readonly location: string,
        readonly conditionInfo: WeatherCondition
        readonly temperature: string,
        readonly feelsLike: string
    } {
        return {
            location: this.point.properties.relativeLocation.properties.city,
            conditionInfo: new WeatherCondition(this.forecast.current_weather.weathercode, true),
            temperature: this.forecast.current_weather.temperature.toFixed(0),
            feelsLike: this.forecast.hourly.apparent_temperature[this.forecast.nowIndex].toFixed(0)  
        };
    }

    /**
     * Gets 48 hours of future values
     */
    * getFutureValues(): Generator<HourInfo> {
        for(let i = this.forecast.nowIndex + 1; i < this.forecast.nowIndex + 49; ++i) {
            yield {
                time: this.forecast.hourly.time[i],
                conditionInfo: new WeatherCondition(this.forecast.hourly.weathercode[i], this.isDay(i)),
                temperature: Math.round(this.forecast.hourly.temperature_2m[i]),
                precipitation_probability: this.forecast.hourly.precipitation_probability[i]
            };
        }
    }

    * getDailyValues(): Generator<DayInfo> {
        const isDay = this.isDay(this.forecast.nowIndex);

        //First value is current time / day
        yield {
            day: "Now",
            conditionInfo: new WeatherCondition(this.forecast.hourly.weathercode[this.forecast.nowIndex], isDay),
            temperature_low: Math.round(this.forecast.daily.temperature_2m_min[0]),
            temperature_high: Math.round(this.forecast.daily.temperature_2m_max[0]),
            precipitation_probability: this.forecast.hourly.precipitation_probability[this.forecast.nowIndex]
        };

        for(let i = 1; i < this.forecast.daily.time.length; ++i) {
            yield {
                day: TimeConversion.getTimeFormatted(this.forecast.daily.time[i], TimeConversion.TimeFormat.Weekday),
                conditionInfo: new WeatherCondition(this.forecast.daily.weathercode[i], true),
                temperature_low: Math.round(this.forecast.daily.temperature_2m_min[i]),
                temperature_high: Math.round(this.forecast.daily.temperature_2m_max[i]),
                precipitation_probability: this.forecast.daily.precipitation_probability_max[i]
            };
        }
    }

    static hasChanceOfRain(info: BaseInfo) {
        switch(info.conditionInfo.type) {
            case WeatherConditionType.CLEAR:
            case WeatherConditionType.MOSTLY_CLEAR:
            case WeatherConditionType.PARTLY_CLOUDY:
            case WeatherConditionType.OVERCAST:
                return false;
            default: 
                return info.precipitation_probability >= 10;
        }
    }
}