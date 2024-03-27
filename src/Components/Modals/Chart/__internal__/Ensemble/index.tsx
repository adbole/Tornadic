import React from "react";
import * as d3 from "d3";

import useEnsemble from "Hooks/useEnsemble";

import Chart from "Components/Chart";
import { Axes, Line, NowReference, Tooltip } from "Components/Chart/Components";

import type { ChartViews } from "../..";
import { Time } from "../Standard/Tooltip";

import TooltipDisplay from "./TooltipDisplay";


export default function Ensemble({ view, day }: { view: ChartViews, day: number}) {
    const { ensemble } = useEnsemble(view, 42.3601, -71.0589);
    
    const dataPoints = React.useMemo(() => {
        if (!ensemble) return undefined;

        const from = day * 24;
        const to = from + 24;

        const x = ensemble.hourly.time
            .slice(from, to)
            .map(time => new Date(time));

        //Each member gives a different forecast.
        //We transpose the data so that we can easily spread all the y values for a common index.
        //This also means we can easily calcluate the max, min, and average for each y

        const memberKeys = Object.keys(ensemble.hourly).filter(key => key !== "time");
        const members = d3.transpose(memberKeys.map(key => ensemble.hourly[key].slice(from, to)));

        const mins = members.map(member => d3.min(member) ?? 0);
        const maxes = members.map(member => d3.max(member) ?? 0);
        const avg = members.map(member => d3.mean(member) ?? 0);

        return x.map((x, i) => ({
            x,
            y: [mins[i], maxes[i], avg[i], ...members[i]],
        }));
    }, [ensemble, day]);

    const getMinMax = React.useCallback(([min, max]: [number, number]): [number, number] => {
        switch (view) {
            case "surface_pressure":
                return [min - 0.3, max + 0.3];
            case "precipitation":
                return [0, Math.max(0.5, max + 0.25)];
            case "relativehumidity_2m":
                return [0, 100];
            case "uv_index":
                return [0, Math.max(11, max)];
            default:
                return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10 + 10];
        }
    }, [view])

    if (!dataPoints || !ensemble) return null;

    return (
        <Chart dataPoints={dataPoints} yBounds={getMinMax} type="linear">
            <Axes />

            {
                //0, 1, 2 are the min, max, and average
                dataPoints.slice(3).map((_, i) => (
                    <Line key={i} yIndex={i} stroke="#636363" />
                ))
            }

            <Line yIndex={0} stroke="white" strokeWidth={3} />
            <Line yIndex={1} stroke="white" strokeWidth={3} />
            <Line yIndex={2} stroke="#0078ef" strokeWidth={3} />

            <NowReference isShown={!day} />

            <Tooltip>
                {
                    dataPoints.every(d => d.y[0] == null) ? (
                        <h1>No Data</h1>
                    ) : (
                        <>
                            <Time day={day} />
                            <TooltipDisplay day={day} view={view}/>
                        </>
                    )
                }
            </Tooltip>
        </Chart>
    )
}