import { useChart } from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";

import getTimeFormatted from "ts/TimeConversion";


export default function Time({ day }: { day: number }) {
    const { dataPoints } = useChart();
    const hoverIndex = useTooltip();

    if (hoverIndex > -1) {
        const dataPoint = dataPoints[hoverIndex];
        return <span>{getTimeFormatted(dataPoint.x, "hourMinute")}</span>;
    }

    return <span>{day === 0 ? "Now" : "Min and Max"}</span>;
}
