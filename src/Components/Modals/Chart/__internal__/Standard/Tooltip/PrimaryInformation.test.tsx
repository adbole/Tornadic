import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";
import * as d3 from "d3";

import type { DataPoint } from "Components/Chart";
import Chart from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";
import type { ChartViews } from "Components/Modals/Chart";

import { trunc } from "ts/Helpers";

import * as TooltipHelpers from "./Helpers";
import { PrimaryInformation } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));
vi.mock("Components/Chart/Components")

vi.spyOn(TooltipHelpers, "getLowHigh");

const dataPoints = d3.range(24).map(d => ({
    x: new Date(d),
    y: [d]
} as DataPoint))

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear" yBounds={x => x}>
            {children}
        </Chart>
    );
}

describe.each([
    "dewpoint_2m",
    "precipitation",
    "relativehumidity_2m",
    "surface_pressure",
    "temperature_2m",
    "us_aqi",
    "uv_index",
    "visibility",
    "windspeed_10m",
] as Array<ChartViews>)("Given view %s", view => {
    test("When given hoverIndex -1 and day 0, mainInformation is current value", () => {
        const weather = useWeather().weather;
        const value = trunc(weather.getForecast(view));
        const unit = weather.getForecastUnit(view);

        vi.mocked(useTooltip).mockReturnValue(-1)

        render(
            <Wrapper>
                <PrimaryInformation day={0} view={view}/>
            </Wrapper>
        );

        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument();
    });

    test("Day > 0 and hoverIndex = -1 uses getLowHigh", () => {
        vi.mocked(useTooltip).mockReturnValue(-1)

        render(
            <Wrapper>
                <PrimaryInformation day={1} view={view}/>
            </Wrapper>
        );

        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledOnce();
        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledWith(expect.anything(), view, 1);
    });

    test("HoverIndex > -1", () => {
        const hoverIndex = 1

        const weather = useWeather().weather;
        const value = dataPoints[hoverIndex].y[0];
        const unit = weather.getForecastUnit(view);

        vi.mocked(useTooltip).mockReturnValue(hoverIndex)

        render(
            <Wrapper>
                <PrimaryInformation day={0} view={view}/>
            </Wrapper>
        );

        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument();
    });
});
