import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";

import { get_aq, get_uv } from "ts/Helpers";

import { ChartViews, DataPoint } from ".";


function getUnit(data: DataPoint, defaultUnit: React.ReactNode) {
    const { property, primaryKey } = data;

    if(property === "uv_index") {
        return " " + get_uv(primaryKey);
    }
    else if(property === "us_aqi") {
        return " " + get_aq(primaryKey);
    }

    return defaultUnit;
}

//Customized tooltip to display primary and secondary data with labels if applicable
const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
    if(!active || !payload || !payload.length) return null;

    const fixDecimal = (property: ChartViews, value: number): string | number => 
        (property === "precipitation" || property === "surface_pressure") ? value.toFixed(2) : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    const unit = getUnit(data, payload[0].unit);
    const label = 
        (data.property === "temperature_2m" && "Feels: ") || 
        (data.property === "windspeed_10m" && "Gust: ");

    return (
        <div className="chart-tooltip">
            <h1>{fixDecimal(data.property, data.primaryKey)}{unit}</h1>
            {data.secondaryKey && <p>{label}{fixDecimal(data.property, data.secondaryKey)}{unit}</p>}
        </div>
    );
};

export default CustomTooltip;