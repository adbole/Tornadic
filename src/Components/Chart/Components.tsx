import { TooltipProps, BarChart, AreaChart, LineChart } from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { DataPoint, ChartViews } from ".";
  
//Customized tooltip to display primary and secondary data with labels if applicable
export const CustomTooltip = ({active, payload}: TooltipProps<number, NameType>) => {
    if(!active || !payload || !payload.length) return null;

    const FixDecimal = (property: ChartViews, value: number): string | number => 
        (property === ChartViews.Precipitation || property === ChartViews.Pressure) ? value.toFixed(2) : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    const unit = payload[0].unit;
    const label = (data.property === ChartViews.Temperature && "Feels: ") || (data.property === ChartViews.Windspeed && "Gust: ");

    return (
        <div className="chart-tooltip">
            <h1>{FixDecimal(data.property, data.primaryKey)}{unit}</h1>
            {data.secondaryKey && <p>{label}{FixDecimal(data.property, data.secondaryKey)}{unit}</p>}
        </div>
    );
};

type ChartDisplayProps = {
    children: React.ReactNode,
    property: ChartViews
} & CategoricalChartProps

//Provides the proper chart to display based on the HourlyProperty passed
export const ChartDisplay = (props: ChartDisplayProps) => {
    const {children, property, ...excess} = props;

    let ChosenChart = BarChart;

    switch(property) {
        case ChartViews.Precipitation:
            ChosenChart = BarChart;
            break;
        case ChartViews.Temperature:
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