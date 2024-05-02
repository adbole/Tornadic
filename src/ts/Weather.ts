import DataConverter from "ts/DataConverter";
import getTimeFormatted from "ts/TimeConversion";
import WeatherCondition from "ts/WeatherCondition";


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
 * The Weather class takes forecast and airquality data along with the user settings to provide access to
 * said data in a uniform way along with extra helper methods.
 * This class is automatically initialized by useOpenMeteo and is used as a value in WeatherContext.
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

        this.nowIndex =
            this.forecast.hourly.time.findIndex(time => new Date(time).getTime() > Date.now()) - 1;

        if (this.nowIndex < 0) {
            console.error("Cannot find current time in forecast data");
            throw new Error("Cannot find current time in forecast data");
        }
    }

    private configureForecast(forecast: Forecast, settings: UserSettings) {
        const converter = new DataConverter(settings);

        forecast.hourly.surface_pressure = converter.convert(
            "surface_pressure",
            forecast.hourly.surface_pressure
        );
        forecast.hourly.visibility = converter.convert("visibility", forecast.hourly.visibility);

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
     * Gets 48 hours of future values
     */
    *getFutureValues(): Generator<HourInfo> {
        const start = this.nowIndex + 1;

        for (let i = start; i < start + 48; ++i) {
            const conditionInfo = this.getWeatherCondition(i);
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
        for (let i = 0; i < this.dayLength; ++i) {
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

    getWeatherCondition(hour: number = this.nowIndex) {
        return new WeatherCondition(this.getForecast("weathercode", hour), this.isDay(hour));
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

    private static hasChanceOfRain(condition: WeatherCondition["type"], precip_prop: number) {
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
