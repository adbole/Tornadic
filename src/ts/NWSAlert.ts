import getTimeFormatted from "ts/TimeConversion";


enum AlertType {
    WARNING,
    ADVISORY,
    STATEMENT,
    WATCH,
    NONE,
}

type Properties = {
    readonly id: string;
    readonly areaDesc: string;
    readonly sent: string;
    readonly effective: string;
    readonly expires: string;
    readonly ends: string;
    readonly severity: string;
    readonly certantiy: string;
    readonly urgency: string;
    readonly event: string;
    readonly senderName: string;
    readonly headline: string;
    readonly description: string;
    readonly instruction: string;
    readonly response: string;
    readonly affectedZones: string[];
    readonly messageType: "Alert" | "Update" | "Cancel" | "Ack" | "Error";
    readonly references: {
        readonly identifier: string;
    }[];
    readonly parameters: {
        readonly expiredReferences: string[] | undefined;
    };
};

//Order of types determines priority ie tsunami is higher than tornado
const alertTypes = [
    "tsunami",
    "tornado",
    "extreme wind",
    "severe thunderstorm",
    "flash flood",
    "severe weather",
    "shelter in place",
    "evacuation immediate",
    "civil danger",
    "nuclear power plant",
    "radiological hazard",
    "hazardous materials",
    "fire",
    "civil emergency message",
    "law enforcement",
    "storm surge",
    "hurricane force wind",
    "hurricane",
    "typhoon",
    "special marine",
    "blizzard",
    "snow squall",
    "ice storm",
    "winter storm",
    "high wind",
    "tropical storm",
    "storm",
    "avalanche",
    "earthquake",
    "volcano",
    "ashfall",
    "coastal flood",
    "lakeshore flood",
    "flood",
    "high surf",
    "dust storm",
    "blowing dust",
    "lake effect snow",
    "excessive heat",
    "gale",
    "wind chill",
    "extreme cold",
    "hard freeze",
    "freeze",
    "red flag",
    "hurricane local",
    "typhoon local",
    "tropical storm local",
    "tropical depression local",
    "winter weather",
    "heat",
    "urban and small stream flood",
    "small stream flood",
    "arroyo and small stream flood",
    "hydrologic",
    "heavy freezing spray",
    "dense fog",
    "dense smoke",
    "small craft",
    "brisk wind",
    "hazardous seas",
    "dust",
    "lake wind",
    "wind",
    "frost",
    "freezing fog",
    "freezing spray",
    "low water",
    "local area emergency",
    "rip current",
    "beach hazards",
    "fire weather",
    "extreme fire danger",
    "911 telephone outage",
    "special weather",
    "marine weather",
    "air quality alert",
    "air stagnation",
    "hazardous weather outlook",
    "hydrologic outlook",
    "short term forecast",
    "administrative message",
    "test",
    "child abduction emergency",
    "blue alert",
]

export default class NWSAlert {
    private declare readonly type: string;
    private declare readonly geometry: {
        readonly type: string;
        readonly coordinates: number[][][];
    } | null;

    private declare readonly properties: Properties;

    // lower is higher priority
    readonly priority: number;

    constructor(alert: NWSAlert) {
        Object.assign(this, alert);

        this.priority = this.getNamePriority() + this.getAlertType();
    }

    get<K extends keyof Omit<Properties, "parameters">>(prop: K): Properties[K] {
        if (prop === "sent" || prop === "effective" || prop === "expires" || prop === "ends") {
            if (!this.properties[prop]) {
                //Don't convert something that is null
                return this.properties[prop];
            }

            return getTimeFormatted(this.properties[prop] as string, "dateTime") as Properties[K];
        }

        return this.properties[prop];
    }

    getParameter<K extends keyof Properties["parameters"]>(prop: K): Properties["parameters"][K] {
        return this.properties.parameters[prop];
    }

    hasCoords() {
        return this.geometry !== null;
    }

    getAlertCSS() {
        return AlertType[this.getAlertType()].toLowerCase();
    }

    private getNamePriority(): number {
        const lastSpace = this.get("event").lastIndexOf(" ");
        const name = this.get("event").slice(0, lastSpace).toLowerCase();

        const index = alertTypes.indexOf(name);
        return index !== -1 ? index : alertTypes.length;
    }

    private getAlertType(): AlertType {
        const lastSpace = this.get("event").lastIndexOf(" ");
        const type = this.get("event")
            .slice(lastSpace + 1)
            .toLowerCase();

        switch (type) {
            case "warning":
                return AlertType.WARNING;
            case "advisory":
                return AlertType.ADVISORY;
            case "statement":
                return AlertType.STATEMENT;
            case "watch":
                return AlertType.WATCH;
            default:
                return AlertType.NONE;
        }
    }
}
