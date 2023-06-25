import { AreaChart, BarChart, LineChart, TooltipProps } from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { NameType } from "recharts/types/component/DefaultTooltipContent";

import { UV_MAX_VALUES } from "ts/Constants";

import { ChartViews, DataPoint } from ".";

function getUnit(data: DataPoint, defaultUnit: React.ReactNode) {
    const { property, primaryKey } = data;

    if(property === ChartViews.UV_Index) {
        if (primaryKey <= UV_MAX_VALUES.LOW) return " Low"; 
        else if (primaryKey <= UV_MAX_VALUES.MODERATE) return " Moderate";
        else if (primaryKey <= UV_MAX_VALUES.HIGH) return " High";
        else if (primaryKey <= UV_MAX_VALUES.VERY_HIGH) return " Very High";
        else return " Extreme"; 
    }

    return defaultUnit;
}
  
//Customized tooltip to display primary and secondary data with labels if applicable
export const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
    if(!active || !payload || !payload.length) return null;

    const fixDecimal = (property: ChartViews, value: number): string | number => 
        (property === ChartViews.Precipitation || property === ChartViews.Pressure) ? value.toFixed(2) : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    let unit = getUnit(data, payload[0].unit);
    const label = (data.property === ChartViews.Temperature && "Feels: ") || (data.property === ChartViews.Windspeed && "Gust: ");


    return (
        <div className="chart-tooltip">
            <h1>{fixDecimal(data.property, data.primaryKey)}{unit}</h1>
            {data.secondaryKey && <p>{label}{fixDecimal(data.property, data.secondaryKey)}{unit}</p>}
        </div>
    );
};

type ChartDisplayProps = {
    children: React.ReactNode,
    property: ChartViews
} & CategoricalChartProps

//Provides the proper chart to display based on the HourlyProperty passed
export const ChartDisplay = (props: ChartDisplayProps) => {
    const { children, property, ...excess } = props;

    let ChosenChart = BarChart;

    switch(property) {
        case ChartViews.Precipitation:
            ChosenChart = BarChart;
            break;
        case ChartViews.Temperature:
        case ChartViews.UV_Index:
            ChosenChart = AreaChart;
            break;
        default:
            ChosenChart = LineChart;
    }

    return (
        <ChosenChart {...excess}>
            {children}
        </ChosenChart>
    );
};