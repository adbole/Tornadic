import React from "react";
import * as d3 from "d3";

import useEnsemble from "Hooks/useEnsemble";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Chart";
import { Axes, Line, NowReference, Tooltip } from "Components/Chart/Components";
import { Button } from "Components/Input";
import { ExclamationTriangle, Spinner } from "svgs";

import { getMinMaxFunc } from "../Shared";
import { Time } from "../Standard/__internal__/Tooltip";

import { AVG_INDEX, MAX_INDEX, MIN_INDEX } from "./__internal__/Constants";
import { Outliers,TooltipDisplay } from "./__internal__";
import { CenteredDisplay } from "./style";


export default function Ensemble({ view, day }: { view: ChartViews, day: number}) {
    const { point } = useWeather();

    const allowedView = view === "us_aqi" ? undefined : view;

    const [long, lat] = point.geometry.coordinates
    const { ensemble, isLoading, error, mutate } = useEnsemble(allowedView, lat, long);
    
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

    if(!allowedView) return (
        <CenteredDisplay>
            <ExclamationTriangle />
            <p>Variable is not supported for Ensemble</p>
        </CenteredDisplay>
    )

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
        <Chart dataPoints={dataPoints} yBounds={getMinMaxFunc(view)} type="linear">
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