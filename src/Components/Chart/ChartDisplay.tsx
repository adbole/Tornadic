import { AreaChart, BarChart, LineChart } from "recharts";
import type { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";

import type { ChartViews } from ".";


type ChartDisplayProps = {
    children: React.ReactNode;
    property: ChartViews;
} & CategoricalChartProps;

//Provides the proper chart to display based on the HourlyProperty passed
export default function ChartDisplay(props: ChartDisplayProps) {
    const { children, property, ...excess } = props;

    let ChosenChart = BarChart;

    switch (property) {
        case "precipitation":
            ChosenChart = BarChart;
            break;
        case "temperature_2m":
        case "uv_index":
        case "us_aqi":
            ChosenChart = AreaChart;
            break;
        default:
            ChosenChart = LineChart;
    }

    return <ChosenChart {...excess}>{children}</ChosenChart>;
}
