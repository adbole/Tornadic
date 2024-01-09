import * as Conditions from "svgs/conditions";


type WeatherConditionType =
    | "Clear"
    | "Mostly Clear"
    | "Partly Cloudy"
    | "Overcast"
    | "Foggy"
    | "Drizzle"
    | "Freezing Drizzle"
    | "Rain"
    | "Freezing Rain"
    | "Snow"
    | "Snow Grains"
    | "Rain Showers"
    | "Snow Showers"
    | "Thunderstorms"
    | "Thunderstorms and Hail";

//Different Intesities a WMO code can have.
type Intesity = "Light" | "Moderate" | "Heavy" | "";

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
    readonly background: [string, string];

    constructor(weathercode: number, isDay: boolean) {
        this.weathercode = weathercode;
        this.type = this.getCondition();
        this.intensity = this.getIntensity();
        this.icon = this.getIcon(isDay);
        this.background = this.getBackground(isDay);
    }

    private getCondition(): WeatherConditionType {
        switch (this.weathercode) {
            case 1:
                return "Mostly Clear";
            case 2:
                return "Partly Cloudy";
            case 3:
                return "Overcast";
            case 45:
            case 48:
                return "Foggy";
            case 51:
            case 53:
            case 55:
                return "Drizzle";
            case 56:
            case 57:
                return "Freezing Drizzle";
            case 61:
            case 63:
            case 65:
                return "Rain";
            case 66:
            case 67:
                return "Freezing Rain";
            case 71:
            case 73:
            case 75:
                return "Snow";
            case 77:
                return "Snow Grains";
            case 80:
            case 81:
            case 82:
                return "Rain Showers";
            case 85:
            case 86:
                return "Snow Showers";
            case 95:
            case 96:
            case 99:
                return "Thunderstorms";
            default:
                return "Clear";
        }
    }

    private getIntensity(): Intesity {
        if (this.weathercode >= 51 && this.weathercode <= 75) {
            //open-meteo's translation of WMO codes has a pattern where the last digit
            //can represent their correlating intesity. This only exists for codes 51 to 75
            const intesity = this.weathercode % 10;

            switch (intesity) {
                case 1:
                case 6:
                    return "Light";
                case 3:
                    return "Moderate";
                case 5:
                case 7:
                    return "Heavy";
            }
        } else if (this.weathercode >= 80 && this.weathercode <= 86) {
            switch (this.weathercode) {
                case 80:
                case 85:
                    return "Light";
                case 81:
                    return "Moderate";
                case 82:
                case 86:
                    return "Heavy";
            }
        }

        return "";
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
            Conditions.Lightning,
        ];

        const filteredCode =
            this.weathercode >= 9 ? Math.trunc(this.weathercode / 10) : this.weathercode;
        return icons[filteredCode];
    }

    private getBackground(isDay: boolean): [string, string] {
        switch (this.type) {
            case "Overcast":
                return isDay ? ["#acb7bd", "#73bae1"] : ["#2d3438", "#31378a"];
            case "Rain":
            case "Rain Showers":
                return ["#0f1c50", "#8da3bd"];
            case "Thunderstorms":
            case "Thunderstorms and Hail":
                return ["#4f5158", "#8da3bd"];
            case "Snow":
            case "Snow Grains":
            case "Snow Showers":
                return ["#797c87", "acb7bd"];
            default:
                return isDay ? ["#52a4da", "#73bae1"] : ["#050f33", "#31378a"];
        }
    }
}
