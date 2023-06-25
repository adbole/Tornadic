import * as Conditions from "svgs/conditions";

export enum WeatherConditionType {
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

//Different Intesities a WMO code can have. 
export enum Intesity {
    LIGHT = "Light",
    MODERATE = "Moderate",
    HEAVY = "Heavy",
    NONE = ""
}

/**
 * Converts a WMO code into three parts to be rendered, the message (type), intesity (if applicable), and the icon.
 * @param weathercode The weathercode to convert
 * @param isDay If applicable icons will return a sun when true or a moon when false. True by default
*/
export default class WeatherCondition {
    private readonly weathercode: number;
    readonly type: WeatherConditionType;
    readonly intensity: Intesity;
    readonly icon: React.ComponentType;

    constructor(weathercode: number, isDay: boolean) {
        this.weathercode = weathercode;
        this.type = this.getCondition();
        this.intensity = this.getIntensity();
        this.icon = this.getIcon(isDay);
    }

    private getCondition() {
        switch(this.weathercode) {
            case 1:
                return WeatherConditionType.MOSTLY_CLEAR;
            case 2:
                return WeatherConditionType.PARTLY_CLOUDY;
            case 3:
                return WeatherConditionType.OVERCAST;
            case 45:
            case 48:
                return WeatherConditionType.FOGGY;
            case 51: 
            case 53: 
            case 55:
                return WeatherConditionType.DRIZZLE;
            case 56: 
            case 57:
                return WeatherConditionType.FREEZING_DRIZZLE;
            case 61: 
            case 63: 
            case 65:
                return WeatherConditionType.RAIN;
            case 66: 
            case 67:
                return WeatherConditionType.FREEZING_RAIN;
            case 71: 
            case 73: 
            case 75:
                return WeatherConditionType.SNOW;
            case 77:
                return WeatherConditionType.SNOW_GRAINS;
            case 80: 
            case 81: 
            case 82:
                return WeatherConditionType.RAIN_SHOWERS;
            case 85: 
            case 86:
                return WeatherConditionType.SNOW_SHOWERS;
            case 95:
                return WeatherConditionType.THUNDERSTORMS;
            case 96: 
            case 99:
                return WeatherConditionType.THRUNDERSTORMS_HAIL;
            default:
                return WeatherConditionType.CLEAR;
        }
    }

    private getIntensity() {
        if(this.weathercode >= 51 && this.weathercode <= 75) {
            //open-meteo's translation of WMO codes has a pattern where the last digit 
            //can represent their correlating intesity. This only exists for codes 51 to 75
            const intesity = this.weathercode % 10;
    
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
        else if(this.weathercode >= 80 && this.weathercode <= 86) {
            switch(this.weathercode) {
                case 80:
                case 85:
                    return Intesity.LIGHT;
                case 81:
                    return Intesity.MODERATE;
                case 82:
                case 86:
                    return Intesity.HEAVY;
                default:
                    return Intesity.NONE;
            }
        }

        return Intesity.NONE;
    }

    private getIcon(isDay: boolean): React.ComponentType {
        const icons = [
            isDay ? Conditions.Sun : Conditions.Moon,
            isDay ? Conditions.CloudSun : Conditions.CloudMoon,
            Conditions.Cloud,
            Conditions.Clouds,
            Conditions.Fog,
            Conditions.Drizzle,
            Conditions.Rain,
            Conditions.Snow,
            //80,81,82 are RAIN_SHOWERS and 85,86 are SNOW_SHOWERS
            this.weathercode <= 82 ? Conditions.Rain : Conditions.Snow,
            Conditions.Lightning
        ];

        const filteredCode = (this.weathercode >= 9 ? Math.trunc(this.weathercode / 10) : this.weathercode);
        return icons[filteredCode];
    }
}