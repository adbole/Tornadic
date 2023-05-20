/**
 * The WeatherData class takes forecast, airquality, point, and alert data to provide access to said data along with helpful methods to act on the data
 */

import { ReactNode } from "react";
import { AirQuality, NWSAlert, Forecast, GridPoint } from "../Components/Contexes/WeatherContext";
import * as Conditions from "../svgs/conditions";
import { Lungs } from '../svgs/widget';
import { TimeConverter } from "./Helpers";

//#region Enum and type definitions
export enum WeatherCondition {
    CLEAR = "Clear",
    MOSTLY_CLEAR = "Mostly Clear",
    PARTLY_CLOUDY = "Partly Cloudy",
    OVERCAST = "Overcast",
    FOGGY = "Foggy",
    DRIZZLE = "Drizzle",
    FREEZING_DRIZZLE = "Freezing Drizzle",
    RAIN = "Rain",
    FREEZING_RAIN = "Freezing Rain",
    SNOW = "Snow",
    SNOW_GRAINS = "Snow Grains",
    RAIN_SHOWERS = "Rain Showers",
    SNOW_SHOWERS = "Snow Showers",
    THUNDERSTORMS = "Thunderstorms",
    THRUNDERSTORMS_HAIL = "Thunderstorms and Hail"
}

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
    conditionInfo: WeatherConditionInfo,
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

type WeatherConditionInfo = Readonly<{ 
    condition: WeatherCondition, 
    intesity: Intesity, 
    icon: ReactNode 
}>

enum AQLevels {
    GOOD = "Good",
    MODERATE = "Moderate",
    UNHEALTHY_SENS = "Unhealthy for Sensitive Groups",
    UNHEALTHY = "Unhealthy",
    VERY_UNHEALTHY = "Very Unhealthy",
    HAZARDOUS = "Hazardous"
}

enum UVLevels {
    LOW = "Low",
    MODERATE = "Moderate",
    HIGH = "High",
    VERY_HIGH = "Very High",
    EXTREME = "Extreme"
}

//Different Intesities a WMO code can have. 
enum Intesity {
    LIGHT = "Light",
    MODERATE = "Moderate",
    HEAVY = "Heavy",
    NONE = "N/A"
}
//#endregion Enum and type definitions

/**
 * The WeatherData class takes forecast, airquality, point, and alert data to provide access to said data along with helpful methods to act on the data.
 * This class is automatically initialized by WeatherContext and is used as the context throughout the application.
 */
export class WeatherData {
    readonly forecast: Forecast;
    readonly airQuality: AirQuality;
    readonly point: GridPoint;
    readonly alerts: NWSAlert[];

    constructor(forecast: Forecast, airQuality: AirQuality, point: GridPoint, alerts: NWSAlert[]) {
        this.forecast = forecast;
        this.airQuality = airQuality;
        this.point = point;
        this.alerts = alerts;
    }

    /**
     * Determines if the given time is day or not based on the sunrise and sunset times of the day
     * @param isoTime The time to check. Is null by default to check current time
     * @param dayValueIndex The day whose sunrise and sunset will be used. Is 0 by default for the current day
     * @returns A boolean indicating if it day or not
     */
    IsDay(isoTime: string | null = null, dayValueIndex: number = 0) {
        //Determine if it is day and set the isDay field
        const time = isoTime ? new Date(isoTime) : new Date();

        const sunrise = new Date(this.forecast.daily.sunrise[dayValueIndex]);
        const sunset = new Date(this.forecast.daily.sunset[dayValueIndex]);

        return time > sunrise && time < sunset;
    }

    GetNow(): {
        location: string,
        conditionInfo: WeatherConditionInfo
        temperature: string,
        feelsLike: string
    } {
        return {
            location: this.point.properties.relativeLocation.properties.city,
            conditionInfo: WeatherData.GetWeatherCondition(this.forecast.current_weather.weathercode),
            temperature: this.forecast.current_weather.temperature.toFixed(0),
            feelsLike: this.forecast.hourly.apparent_temperature[this.forecast.nowIndex].toFixed(0)  
        };
    }

    /**
     * Gets 48 hours of future values
     */
    * GetFutureValues(): Generator<HourInfo> {
        let currentDayIndex = 0;

        for(let i = this.forecast.nowIndex + 1; i < this.forecast.nowIndex + 49; ++i) {
            //If the current time is in the next day, incremenet the currentDayIndex for proper use of the IsDay method
            if(new Date(this.forecast.hourly.time[i]) >= new Date(this.forecast.daily.time[currentDayIndex + 1])) {
                currentDayIndex += 1;
            }

            //Determine if this time is day to get the proper icon from GetWeatherCondition
            const isDay = this.IsDay(this.forecast.hourly.time[i], currentDayIndex);

            yield {
                time: this.forecast.hourly.time[i],
                conditionInfo: WeatherData.GetWeatherCondition(this.forecast.hourly.weathercode[i], isDay),
                temperature: Math.round(this.forecast.hourly.temperature_2m[i]),
                precipitation_probability: this.forecast.hourly.precipitation_probability[i]
            };
        }
    }

    * GetDailyValues(): Generator<DayInfo> {
        const isDay = this.IsDay(this.forecast.hourly.time[this.forecast.nowIndex], 0);

        //First value is current time / day
        yield {
            day: "Now",
            conditionInfo: WeatherData.GetWeatherCondition(this.forecast.hourly.weathercode[this.forecast.nowIndex], isDay),
            temperature_low: Math.round(this.forecast.daily.temperature_2m_min[0]),
            temperature_high: Math.round(this.forecast.daily.temperature_2m_max[0]),
            precipitation_probability: this.forecast.hourly.precipitation_probability[this.forecast.nowIndex]
        };

        for(let i = 1; i < this.forecast.daily.time.length; ++i) {
            yield {
                day: TimeConverter.GetTimeFormatted(this.forecast.daily.time[i], TimeConverter.TimeFormat.Weekday),
                conditionInfo: WeatherData.GetWeatherCondition(this.forecast.daily.weathercode[i]),
                temperature_low: Math.round(this.forecast.daily.temperature_2m_min[i]),
                temperature_high: Math.round(this.forecast.daily.temperature_2m_max[i]),
                precipitation_probability: this.forecast.daily.precipitation_probability_max[i]
            };
        }
    }

    //#region Static Definitions

    /**
     * Converts a WMO code into three parts to be rendered, the message (condition), intesity (if applicable), and the icon.
     * @param weathercode The weathercode to convert
     * @param isDay If applicable icons will return a sun when true or a moon when false. True by default
    */
    private static GetWeatherCondition(weathercode: number, isDay: boolean = true): WeatherConditionInfo {
        function GetIntensity(weatherCode: number): Intesity {
            //open-meteo's translation of WMO codes has a pattern where the last digit of those with different intesities being nearly always consistant.
            //Some codes don't havfe intesities and shouldn't be fed to this method otherwise false input will be given.
            const intesity = weatherCode % 10;
        
            switch(intesity) {
                case 1:
                case 6:
                    return Intesity.LIGHT;
                case 3:
                    return Intesity.MODERATE;
                case 5:
                case 7:
                    return Intesity.HEAVY;
                default:
                    return Intesity.NONE;
            }
        }

        let condition: WeatherCondition;
        let intesity: Intesity = Intesity.NONE;
        let icon: ReactNode;

        switch(weathercode) {
            case 1: 
                condition = WeatherCondition.MOSTLY_CLEAR;
                icon = isDay ? <Conditions.CloudSun/> : <Conditions.CloudMoon/>;
                break;
            case 2: 
                condition = WeatherCondition.PARTLY_CLOUDY;
                icon = <Conditions.Cloudy/>;
                break;
            case 3:
                condition = WeatherCondition.OVERCAST;
                icon = <Conditions.Clouds/>;
                break;
            case 45:
            case 48:
                condition = WeatherCondition.FOGGY;
                icon = <Conditions.Fog/>;
                break;
            case 51:
            case 53:
            case 55:
                condition = WeatherCondition.DRIZZLE;
                icon = <Conditions.Drizzle/>;
                break;
            case 56:
            case 57:
                condition = WeatherCondition.FREEZING_DRIZZLE;
                icon = <Conditions.Drizzle/>;
                break;
            case 61:
            case 63:
            case 65:
                condition = WeatherCondition.RAIN;
                intesity = GetIntensity(weathercode);
                icon = <Conditions.Rain/>;
                break;
            case 66: //Light Intesity
            case 67: 
                condition = WeatherCondition.FREEZING_RAIN;
                intesity = GetIntensity(weathercode);
                icon = <Conditions.Rain/>;
                break;
            case 71:
            case 73:
            case 75:
                condition = WeatherCondition.SNOW;
                intesity = GetIntensity(weathercode);
                icon = <Conditions.Snow/>;
                break;
            case 77:
                condition = WeatherCondition.SNOW_GRAINS;
                icon = <Conditions.Snow/>;
                break;
            case 80:
            case 81:
            case 82:
                condition = WeatherCondition.RAIN_SHOWERS;
                icon = <Conditions.Rain/>;
                break;
            case 85:
            case 86:
                condition = WeatherCondition.SNOW_SHOWERS;
                icon = <Conditions.Snow/>;
                break;
            case 95:
                condition = WeatherCondition.THUNDERSTORMS;
                icon = <Conditions.Lightning/>;
                break;
            case 96:
            case 99:
                condition = WeatherCondition.THRUNDERSTORMS_HAIL;
                icon = <Conditions.Lightning/>;
                break;
            default: //0
                condition = WeatherCondition.CLEAR;
                icon = isDay ? <Conditions.Sun/> : <Conditions.Moon/>;
        }

        return {
            condition: condition,
            intesity: intesity,
            icon: icon
        };
    }
    
    static GetAQInfo(aq: number): HazardInfo {
        let message: string;

        if     (aq <= 50)  { message = AQLevels.GOOD; }
        else if(aq <= 100) { message = AQLevels.MODERATE; }
        else if(aq <= 150) { message = AQLevels.UNHEALTHY_SENS; }
        else if(aq <= 200) { message = AQLevels.UNHEALTHY; }
        else if(aq <= 300) { message = AQLevels.VERY_UNHEALTHY; }
        else               { message = AQLevels.VERY_UNHEALTHY; }

        return {
            id: "AQ",
            title: "Air Quality",
            titleIcon: <Lungs />,
            value: aq,
            min: 0,
            max: 500,
            message: message
        };
    }

    static GetUVInfo(uv: number): HazardInfo {
        let message: string;

        if     (uv <= 2)  { message = UVLevels.LOW; }
        else if(uv <= 5)  { message = UVLevels.MODERATE; }
        else if(uv <= 7)  { message = UVLevels.HIGH; }
        else if(uv <= 10) { message = UVLevels.VERY_HIGH; }
        else              { message = UVLevels.EXTREME; }

        return {
            id: "UV",
            title: "UV Index",
            titleIcon: <Conditions.Sun />,
            value: uv,
            min: 0,
            max: 11,
            message: message
        };
    }

    static IsRaining(info: BaseInfo) {
        switch(info.conditionInfo.condition) {
            case WeatherCondition.CLEAR:
            case WeatherCondition.MOSTLY_CLEAR:
            case WeatherCondition.PARTLY_CLOUDY:
            case WeatherCondition.OVERCAST:
                return false;
            default: 
                return info.precipitation_probability > 0;
        }
    }

    //#endregion
}