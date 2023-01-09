import { ReactNode } from "react";
import { Forecast } from "../Components/WeatherContext";
import { Tornadic } from "../svgs/svgs";
import * as Conditions from "../svgs/conditions/conditions.svgs"

type WeatherCondition = {
    condition: string,
    intesity: Intesity
    icon: ReactNode
}

enum Intesity {
    LIGHT = "Light",
    MODERATE = "Moderate",
    HEAVY = "Heavy",
    NONE = "N/A"
}

function GetIntensity(weatherCode: number) {
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
    static GetWeatherCondition(weathercode: number) {
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
        } as WeatherCondition
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
            key: 0,
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

    static GetAQMessage(aq: number) {
        if(aq <= 50) {
            return "Good"
        }
        else if(aq <= 100) {
            return "Moderate"
        }
        else if(aq <= 150) {
            return "Unhealthy*"
        }
        else if(aq <= 200) {
            return "Unhealthy"
        }
        else if(aq <= 300) {
            return "Very Unhealthy"
        }
        else {
            return "Hazardous"
        }
    }

    static GetUVMessage(uv: number) {
        if(uv <= 2) {
            return "Low"
        }
        else if(uv <= 5) {
            return "Moderate"
        }
        else if(uv <= 7) {
            return "High"
        }
        else if(uv <= 10) {
            return "Very High"
        }
        else {
            return "Extreme"
        }
    }
}