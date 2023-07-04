import { Area, Bar, Line } from "recharts";

import { get_aq, get_uv, nameof, toHSL } from "ts/Helpers";

import { ChartViews, DataPoint } from ".";


export default function getDataVisual(unit: string, view: ChartViews, dataPoints: DataPoint[]) {
    switch(view) {
        case "precipitation":
            return <Bar dataKey={nameof<DataPoint>("primaryKey")} fill={"#0078ef"} unit={unit}/>;
        case "temperature_2m": {
            const dataValues = dataPoints.flatMap(point => [point.primaryKey, (point.secondaryKey as number) ?? 0]);
            const min = Math.min(...dataValues);
            const max = Math.max(...dataValues);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={toHSL(Math.min(120, max))}/>
                            <stop offset="100%" stopColor={toHSL(Math.max(0, min))}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#ffffff00" fillOpacity={0.75} fill="url(#tempGradient)" unit={unit}/>
                    <Area type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#fff" fillOpacity={0}/>
                </>
            );
        }
        case "uv_index": {
            const maxUV = Math.max(...dataPoints.map(point => point.primaryKey));
            const maxLevel = get_uv(maxUV);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            {maxLevel === "Extreme" && <stop offset="0%" stopColor="#FF00D6"/>}
                            {maxLevel === "Very High" && <stop offset="25%" stopColor="#FF2204"/>}
                            {maxLevel === "High" && <stop offset="50%" stopColor="#FF9431"/>}
                            {maxLevel === "Moderate" && <stop offset="75%" stopColor="#FFF501"/>}
                            <stop offset="100%" stopColor="#00FF66"/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#ffffff00" fillOpacity={0.75} fill="url(#tempGradient)"/>
                </>
            );
        }
        case "us_aqi": {
            const maxAQ = Math.max(...dataPoints.map(point => point.primaryKey));
            const maxLevel = get_aq(maxAQ);

            return (
                <>
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            {maxLevel === "Hazardous" && <stop offset="0%" stopColor="#6D0000"/>}
                            {maxLevel === "Very Unhealthy" && <stop offset="20%" stopColor="#8400FF"/>}
                            {maxLevel === "Unhealthy" && <stop offset="40%" stopColor="#FF2204"/>}
                            {maxLevel === "Unhealthy*" && <stop offset="60%" stopColor="#FF9431"/>}
                            {maxLevel === "Moderate" && <stop offset="80%" stopColor="#FFF501"/>}
                            <stop offset="100%" stopColor="#00FF66"/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#ffffff00" fillOpacity={0.75} fill="url(#tempGradient)"/>
                </>
            );
        }
        default:
            return (
                <>
                    <Line type="monotone" dataKey={nameof<DataPoint>("primaryKey")} stroke="#2668f7" unit={unit}/>
                    {dataPoints[0].secondaryKey != null && <Line type="monotone" dataKey={nameof<DataPoint>("secondaryKey")} stroke="#2eff7d"/>}
                </>
            );
    }
}