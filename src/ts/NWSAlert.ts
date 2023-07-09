import getTimeFormatted from "ts/TimeConversion";


enum AlertType {
    WARNING,
    ADVISORY,
    STATEMENT,
    WATCH,
    NONE
}

type Properties = {
    readonly id: string
    readonly areaDesc: string
    readonly sent: string
    readonly effective: string
    readonly expires: string
    readonly ends: string
    readonly severity: string
    readonly certantiy: string
    readonly urgency: string
    readonly event: string
    readonly senderName: string
    readonly headline: string
    readonly description: string
    readonly instruction: string
    readonly response: string
}

export default class NWSAlert {
    declare private readonly geometry: {
        // [Polygons][Polygon][Points]
        readonly coordinates: number[][][]
    } | null;

    declare private readonly properties: Properties;

    // lower is higher priority
    readonly priority: number;

    constructor(alert: NWSAlert) {
        Object.assign(this, alert);

        this.priority = this.getNamePriority() + this.getAlertType();
    }

    get<K extends keyof Properties>(prop: K): Properties[K] {
        if(prop === "sent" || prop === "effective" || prop === "expires" || prop === "ends") {
            if(!this.properties[prop]) {
                //Don't convert something that is null
                return this.properties[prop];
            }
                
            return getTimeFormatted(this.properties[prop], "dateTime");
        }

        return this.properties[prop];
    }

    /**
     * @returns An array of polygons
     */
    getCoords() {
        return this.geometry?.coordinates;
    }

    getAlertCSS() {
        return "alert-" + AlertType[this.getAlertType()].toLowerCase();
    }

    getNamePriority(): number {
        const lastSpace = this.get("event").lastIndexOf(" ");
        const name = this.get("event").slice(0, lastSpace).toLowerCase();

        switch(name) {
            case "tsunami": return 1;
            case "tornado": return 2;
            case "extreme wind": return 3;
            case "severe thunderstorm": return 4;
            case "flash flood": return 5;
            case "severe weather": return 6;
            case "shelter in place": return 7;
            case "evacuation immediate": return 8;
            case "civil danger": return 9;
            case "nuclear power plant": return 10;
            case "radiological hazard": return 11;
            case "hazardous materials": return 12;
            case "fire": return 13;
            case "civil emergency message": return 14;
            case "law enforcement": return 15;
            case "storm surge": return 16;
            case "hurricane force wind": return 17;
            case "hurricane": return 18;
            case "typhoon": return 19;
            case "special marine": return 20;
            case "blizzard": return 21;
            case "snow squall": return 22;
            case "ice storm": return 23;
            case "winter storm": return 24;
            case "high wind": return 25;
            case "tropical storm": return 26;
            case "storm": return 27;
            case "avalanche": return 28;
            case "earthquake": return 29;
            case "volcano": return 30;
            case "ashfall": return 31;
            case "coastal flood": return 32;
            case "lakeshore flood": return 33;
            case "flood": return 34;
            case "high surf": return 35;
            case "dust storm": return 36;
            case "blowing dust": return 37;
            case "lake effect snow": return 38;
            case "excessive heat": return 39;
            case "gale": return 40;
            case "wind chill": return 41;
            case "extreme cold": return 42;
            case "hard freeze": return 43;
            case "freeze": return 44;
            case "red flag": return 45;
            case "hurricane local": return 46;
            case "typhoon local": return 47;
            case "tropical storm local": return 48;
            case "tropical depression local": return 49;
            case "winter weather": return 50;
            case "heat": return 51;
            case "urban and small stream flood": return 52;
            case "small stream flood": return 53;
            case "arroyo and small stream flood": return 54;
            case "hydrologic": return 55;
            case "heavy freezing spray": return 56;
            case "dense fog": return 57;
            case "dense smoke": return 58;
            case "small craft": return 59;
            case "brisk wind": return 60;
            case "hazardous seas": return 61;
            case "dust": return 62;
            case "lake wind": return 63;
            case "wind": return 64;
            case "frost": return 65;
            case "freezing fog": return 66;
            case "freezing spray": return 67;
            case "low water": return 68;
            case "local area emergency": return 69;
            case "rip current": return 70;
            case "beach hazards": return 71;
            case "fire weather": return 72;
            case "extreme fire danger": return 73;
            case "911 telephone outage": return 74;
            case "special weather": return 75;
            case "marine weather": return 76;
            case "air quality alert": return 77;
            case "air stagnation": return 78;
            case "hazardous weather outlook": return 79;
            case "hydrologic outlook": return 80;
            case "short term forecast": return 81;
            case "administrative message": return 82;
            case "test": return 83;
            case "child abduction emergency": return 84;
            case "blue alert": return 85;
            default: return 100;
        }
    }

    getAlertType(): AlertType {
        const lastSpace = this.get("event").lastIndexOf(" ");
        const type = this.get("event").slice(lastSpace + 1).toLowerCase();

        switch(type) {
            case "warning":   return AlertType.WARNING;
            case "watch":     return AlertType.WATCH;
            case "advisory":  return AlertType.ADVISORY;
            case "statement": return AlertType.STATEMENT;
            default:          return AlertType.NONE;
        }
    }
}