import getTimeFormatted from "ts/TimeConversion";

import { useChart } from "../../ChartContext";


export default function Time({ day, hoverIndex }: { day: number; hoverIndex: number }) {
    const { dataPoints } = useChart();

    if (hoverIndex > -1) {
        const dataPoint = dataPoints[hoverIndex];
        return <span>{getTimeFormatted(dataPoint.x, "hourMinute")}</span>;
    }

    return <span>{day === 0 ? "Now" : "Min and Max"}</span>;
}
