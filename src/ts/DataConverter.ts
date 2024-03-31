type ConvertableProperty = keyof Omit<
    Forecast["hourly"], 
    "time"
>

/**
 * Converts the data points of a forecast to a different unit
 * Helps to ensure consistency within the application
 */
export default class DataConverter {
    private readonly visibilityDivisor: number;
    private readonly pressureDivisor: number;

    constructor(settings: UserSettings) {
        // feet to miles | meters to km
        this.visibilityDivisor = settings.precipitation === "inch" ? 5280 : 1000;
        //hPa to inHG
        this.pressureDivisor = 33.864;
    }

    public convert<K extends ConvertableProperty>(property: ConvertableProperty, data: Forecast["hourly"][K]) {
        switch(property) {
            case "surface_pressure":
                return data.map(this.convertSurfacePressure.bind(this));
            case "visibility":
                return data.map(this.convertVisibility.bind(this));
            default:
                return data;
        }
    }

    private convertSurfacePressure(value: number) {
        return value / this.pressureDivisor;
    }

    private convertVisibility(value: number) {
        return value / this.visibilityDivisor;
    }
}