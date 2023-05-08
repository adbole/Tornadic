import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { DataPoint, HourlyProperties } from "./Chart";

//Airpressure needs a special tick in order to display properly
export const PressureTick = ({x, y, payload, unit}: {x: number, y:number, payload: {value: number}, unit: string} & any) => (
    <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={5} fill="#666">
        <tspan textAnchor="end" x="0">{payload.value.toFixed(2)}</tspan>
        <tspan textAnchor="end" x="0" dy="20">{unit}</tspan>
        </text>
    </g>
);
  
//Customized tooltip to display primary and secondary data with labels if applicable
export const CustomTooltip = ({active, payload}: TooltipProps<number, NameType>) => {
    if(!active || ! payload || !payload.length) return null;

    const FixDecimal = (property: HourlyProperties, value: number): string | number => 
        (property === HourlyProperties.Precipitation || property === HourlyProperties.Pressure) ? value.toFixed(2) : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    const unit = payload[0].unit;
    const label = (data.property === HourlyProperties.Temperature && "Feels: ") || (data.property === HourlyProperties.Windspeed && "Gust: ");

    return (
        <div className="chart-tooltip">
            <h1>{FixDecimal(data.property, data.primaryKey)}{unit}</h1>
            {data.secondaryKey && <p>{label}{FixDecimal(data.property, data.secondaryKey)}{unit}</p>}
        </div>
    );
};