import React from "react";
import * as d3 from "d3";

import useEnsemble from "Hooks/useEnsemble";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Axes, Line, NowReference, Tooltip } from "Components/Chart/Components";
import { Button } from "Components/Input";
import type { ChartViews } from "Components/Modals/Chart";
import { ExclamationTriangle, Spinner } from "svgs";

import { Time } from "../Standard/Tooltip";

import { AVG_INDEX, MAX_INDEX, MIN_INDEX } from "./__internal__/Constants";
import { Outliers,TooltipDisplay } from "./__internal__";
import { CenteredDisplay } from "./style";


export default function Ensemble({ view, day }: { view: Exclude<ChartViews, "us_aqi">, day: number}) {
    const { point } = useWeather();

    const [long, lat] = point.geometry.coordinates
    const { ensemble, isLoading, error, mutate } = useEnsemble(view, lat, long);
    
    const dataPoints = React.useMemo(() => {
        if (!ensemble) return undefined;

        const from = day * 24;
        const to = from + 24;

        const x = ensemble.time
            .slice(from, to)
            .map(time => new Date(time));

        //Each member gives a different forecast.
        //We transpose the data so that we can easily spread all the y values for a common index.
        //This also means we can easily calcluate the max, min, and average for each y
        const members = d3.transpose(ensemble.data.map(member => member.slice(from, to)));

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

    if (isLoading) return (
        <CenteredDisplay>
            <Spinner />
            <p>Fetching Ensemble Data</p>
        </CenteredDisplay>
    )

    if(error) return (
        <CenteredDisplay>
            <ExclamationTriangle />
            <p>An error occurred while getting the data</p>
            <Button onClick={() => mutate(ensemble)}>Try Again</Button>
        </CenteredDisplay>
    )

    if (!dataPoints || !ensemble) return null;

    return (
        <Chart dataPoints={dataPoints} yBounds={getMinMax} type="linear">
            <Axes />

            <g>
                {
                    //0, 1, 2 are the min, max, and average
                    ensemble.data.map((_, i) => (
                        <Line key={i} yIndex={AVG_INDEX + i} stroke="#636363" />
                    ))
                }
            </g>

            <g>
                <Line yIndex={MIN_INDEX} stroke="white" strokeWidth={3} />
                <Line yIndex={MAX_INDEX} stroke="white" strokeWidth={3} />
                <Line yIndex={AVG_INDEX} stroke="#0078ef" strokeWidth={3} />
            </g>


            <Outliers fill="red"/>

            <NowReference isShown={!day} />

            <Tooltip>
                {
                    dataPoints.every(d => d.y.every(value => value == null)) ? (
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