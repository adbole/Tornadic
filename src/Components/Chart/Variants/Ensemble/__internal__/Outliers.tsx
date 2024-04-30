import React from "react";
import * as d3 from "d3";

import { useChart } from "Components/Chart";

import { AVG_INDEX } from "./Constants";


export default function Points({
    ...SVGProps
}: {
} & React.SVGProps<SVGGElement>) {
    const group = React.useRef<SVGGElement | null>(null);

    const { x, y, dataPoints } = useChart();

    const outliers = React.useMemo(() => {
        if(!dataPoints) return undefined;

        const outliers = dataPoints.map(d => {
            const yPoints = d.y.slice(AVG_INDEX + 1)

            const firstQuartile = d3.quantile(yPoints, 0.25)!
            const thirdQuantile = d3.quantile(yPoints, 0.75)!
            const iqr = (thirdQuantile - firstQuartile) * 1.5

            return {
                x: d.x,
                y: yPoints.filter(value => value > thirdQuantile + iqr || value < firstQuartile - iqr)
            }
        })

        return outliers.flatMap(d => d.y.map(y => [d.x, y] as [Date, number]))
    }, [dataPoints])

    React.useEffect(() => {
        if (!group.current || !outliers) return;

        d3.select(group.current)
            .selectAll("circle")
            .data(outliers)
            .join(
                enter => 
                    enter            
                        .append("circle")
                        .attr("cx", ([xValue, _]: [Date, number]) => x(xValue) as number)
                        .attr("cy", ([_, yValue]: [Date, number]) => y(yValue) as number)
                        .attr("r", 0)
                        .transition()
                        .attr("r", 4)
                        .delay((_, i) => i * 50) as any,
                update => 
                    update
                        .transition()
                        .duration(500)
                        .attr("cx", ([xValue, _]: [Date, number]) => x(xValue) as number)
                        .attr("cy", ([_, yValue]: [Date, number]) => y(yValue) as number),
                remove => remove.remove()
            )
    }, [x, y, outliers]);

    return <g ref={group} {...SVGProps} />;
}
