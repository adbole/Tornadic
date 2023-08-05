/* eslint-disable no-fallthrough */
import { Area, Bar, Line } from "recharts";

import { UserSettings } from "Contexts/SettingsContext/index.types";

import { get_aq, get_uv, nameof, toHSL } from "ts/Helpers";

import { ChartViews, DataPoint } from ".";


function* getUVGradient(value: number) {
    const uv = get_uv(value);

    switch (uv) {
        case "Extreme":
            yield <stop offset="0%" stopColor="#FF00D6" />;
        case "Very High":
            yield <stop offset="25%" stopColor="#FF2204" />;
        case "High":
            yield <stop offset="50%" stopColor="#FF9431" />;
        case "Moderate":
            yield <stop offset="75%" stopColor="#FFF501" />;
        case "Low":
            yield <stop offset="100%" stopColor="#00FF66" />;
    }
}

function* getAQGradient(value: number) {
    const aq = get_aq(value);

    switch (aq) {
        case "Hazardous":
            yield <stop offset="0%" stopColor="#6D0000" />;
        case "Very Unhealthy":
            yield <stop offset="20%" stopColor="#8400FF" />;
        case "Unhealthy":
            yield <stop offset="40%" stopColor="#FF2204" />;
        case "Unhealthy*":
            yield <stop offset="60%" stopColor="#FF9431" />;
        case "Moderate":
            yield <stop offset="80%" stopColor="#FFF501" />;
        case "Good":
            yield <stop offset="100%" stopColor="#00FF66" />;
    }
}

export default function getDataVisual(
    unit: string,
    view: ChartViews,
    dataPoints: DataPoint[],
    settings: UserSettings
) {
    switch (view) {
        case "precipitation":
            return <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} unit={unit} />;
        case "temperature_2m": {
            const dataValues = dataPoints.flatMap(point => [
                point.primaryKey,
                (point.secondaryKey as number) ?? 0,
            ]);
            const min = Math.min(...dataValues);
            const max = Math.max(...dataValues);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={toHSL(max, settings.tempUnit)} />
                            <stop offset="100%" stopColor={toHSL(min, settings.tempUnit)} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey={nameof<DataPoint>("primaryKey")}
                        stroke="#ffffff00"
                        fillOpacity={0.75}
                        fill="url(#tempGradient)"
                        unit={unit}
                    />
                    <Area
                        type="monotone"
                        dataKey={nameof<DataPoint>("secondaryKey")}
                        stroke="#fff"
                        fillOpacity={0}
                    />
                </>
            );
        }
        case "uv_index": {
            const maxUV = Math.max(...dataPoints.map(point => point.primaryKey));

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            {[...getUVGradient(maxUV)]}
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey={nameof<DataPoint>("primaryKey")}
                        stroke="#ffffff00"
                        fillOpacity={0.75}
                        fill="url(#tempGradient)"
                    />
                </>
            );
        }
        case "us_aqi": {
            const maxAQ = Math.max(...dataPoints.map(point => point.primaryKey));

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            {[...getAQGradient(maxAQ)]}
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey={nameof<DataPoint>("primaryKey")}
                        stroke="#ffffff00"
                        fillOpacity={0.75}
                        fill="url(#tempGradient)"
                    />
                </>
            );
        }
        default:
            return (
                <>
                    <Line
                        type="monotone"
                        dataKey={nameof<DataPoint>("primaryKey")}
                        stroke="#2668f7"
                        unit={unit}
                    />
                    {dataPoints[0].secondaryKey != null && (
                        <Line
                            type="monotone"
                            dataKey={nameof<DataPoint>("secondaryKey")}
                            stroke="#2eff7d"
                        />
                    )}
                </>
            );
    }
}
