/**
 * The WeatherHelper contains methods that can read WeatherData to transform it into useful objects that are then consumed by components to be rendered.
 */

import { ReactNode } from "react";
import { Forecast, WeatherData } from "../Components/WeatherContext";
import * as Conditions from "../svgs/conditions/conditions.svgs"
import { Lungs } from '../svgs/widget/widget.svgs'

export type HazardInfo = {
    id: string, //Used to distinguish the different gradient requirements in CSS
    title: string,
    titleIcon: ReactNode,
    value: number,
    min: number,
    max: number,
    message: string
}

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

enum HazardColor {
    GREEN = "green",
    YELLOW = "yellow",
    ORANGE = "orange",
    RED = "red",
    MAROON = "maroon",
    PURPLE = "purple",
    PINK = "pink"
}

//Used to represent a WMO code in three parts to be rendered, the message (condition), intesity (if applicable), and the icon.
type WeatherCondition = {
    condition: string,
    intesity: Intesity
    icon: ReactNode
}

//Different Intesities a WMO code can have. 
enum Intesity {
    LIGHT = "Light",
    MODERATE = "Moderate",
    HEAVY = "Heavy",
    NONE = "N/A"
}

function GetIntensity(weatherCode: number): Intesity {
    //open-meteo's translation of WMO codes has a pattern where the last digit of those with different intesities being nearly always consistant.
    //Some codes don't havfe intesities and shouldn't be fed to this method otherwise false input will be given.
    const intesity = weatherCode % 10

    switch(intesity) {
        case 1:
        case 6:
            return Intesity.LIGHT
        case 3:
            return Intesity.MODERATE
        case 5:
        case 7:
            return Intesity.HEAVY
        default:
            return Intesity.NONE
    }
}

export class WeatherHelper {
    static GetWeatherCondition(weathercode: number): WeatherCondition {
        let condition: string
        let intesity: Intesity = Intesity.NONE
        let icon: ReactNode

        switch(weathercode) {
            case 1: 
                condition = "Mostly Clear"
                icon = <Conditions.Cloud_Sun/>
                break;
            case 2: 
                condition = "Partly Cloudy"
                icon = <Conditions.Cloudy/>
                break;
            case 3:
                condition = "Overcast"
                icon = <Conditions.Clouds/>
                break;
            case 45:
            case 48:
                condition = "Foggy"
                icon = <Conditions.Fog/>
                break;
            case 51:
            case 53:
            case 55:
                condition = "Drizzle"
                icon = <Conditions.Drizzle/>
                break;
            case 56:
            case 57:
                condition = "Freezing Drizzle"
                icon = <Conditions.Drizzle/>
                break;
            case 61:
            case 63:
            case 65:
                condition = "Rain"
                intesity = GetIntensity(weathercode)
                icon = <Conditions.Rain/>
                break;
            case 66: //Light Intesity
            case 67: 
                condition = "Freezing Rain"
                intesity = GetIntensity(weathercode);
                icon = <Conditions.Rain/>
                break;
            case 71:
            case 73:
            case 75:
                condition = "Snow"
                intesity = GetIntensity(weathercode);
                icon = <Conditions.Snow/>
                break;
            case 77:
                condition = "Snow Grains"
                icon = <Conditions.Snow/>
                break;
            case 80:
            case 81:
            case 82:
                condition = "Rain Showers"
                icon = <Conditions.Rain/>
                break;
            case 85:
            case 86:
                condition = "Snow Showers"
                icon = <Conditions.Snow/>
                break;
            case 95:
                condition = "Thunderstorms"
                icon = <Conditions.Lightning/>
                break;
            case 96:
            case 99:
                condition = "Thunderstorms and Hail"
                icon = <Conditions.Lightning/>
                break;
            default: //0
                condition = "Clear"
                icon = <Conditions.Sun/>
        }

        return {
            condition: condition,
            intesity: intesity,
            icon: icon
        }
    }

    static * GetFutureValues(forecast: Forecast) {
        for(let i = forecast.currentIndex + 1; i < forecast.hourly.time.length; ++i) {
            yield {
                time: forecast.hourly.time[i],
                condition: this.GetWeatherCondition(forecast.hourly.weathercode[i]),
                temperature: Math.round(forecast.hourly.temperature_2m[i])
            }
        }
    }

    static * GetDailyValues(forecast: Forecast) {
        //First value is today
        yield {
            day: "Now",
            condition: this.GetWeatherCondition(forecast.daily.weathercode[0]),
            temperature_low: Math.round(forecast.daily.temperature_2m_min[0]),
            temperature_high: Math.round(forecast.daily.temperature_2m_max[0]),
        }

        for(let i = 1; i < forecast.daily.time.length; ++i) {
            yield {
                day: new Date(forecast.daily.time[i] + " " + forecast.timezone_abbreviation).toLocaleDateString("en-US", {weekday: "short"}),
                condition: this.GetWeatherCondition(forecast.daily.weathercode[i]),
                temperature_low: Math.round(forecast.daily.temperature_2m_min[i]),
                temperature_high: Math.round(forecast.daily.temperature_2m_max[i]),
            }
        }
    }

    static ToKM(meters: number) {
        return (meters / 1000).toFixed(0)
    }

    static GetAQInfo(aq: number): HazardInfo {
        let message: string;

        if(aq <= 50) {
            message = AQLevels.GOOD
        }
        else if(aq <= 100) {
            message = AQLevels.MODERATE
        }
        else if(aq <= 150) {
            message = AQLevels.UNHEALTHY_SENS
        }
        else if(aq <= 200) {
            message = AQLevels.UNHEALTHY
        }
        else if(aq <= 300) {
            message = AQLevels.VERY_UNHEALTHY
        }
        else {
            message = AQLevels.VERY_UNHEALTHY
        }

        return {
            id: "AQ",
            title: "Air Quality",
            titleIcon: <Lungs />,
            value: aq,
            min: 0,
            max: 500,
            message: message
        }
    }

    static GetUVInfo(uv: number): HazardInfo {
        let message: string;

        if(uv <= 2) {
            message = UVLevels.LOW
        }
        else if(uv <= 5) {
            message = UVLevels.MODERATE
        }
        else if(uv <= 7) {
            message = UVLevels.HIGH
        }
        else if(uv <= 10) {
            message = UVLevels.VERY_HIGH
        }
        else {
            message = UVLevels.EXTREME
        }

        return {
            id: "UV",
            title: "UV Index",
            titleIcon: <Conditions.Sun />,
            value: uv,
            min: 0,
            max: 11,
            message: message
        }
    }
}