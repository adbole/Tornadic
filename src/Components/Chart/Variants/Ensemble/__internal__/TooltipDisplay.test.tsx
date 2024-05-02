import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render, screen } from "@testing-library/react";

import Chart from "Components/Chart";
import { useTooltip } from "Components/Chart/Components";

import { trunc } from "ts/Helpers";

import { TooltipDisplay } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));
vi.mock("Components/Chart/Components");
vi.mock("ts/Helpers", () => ({
    trunc: vi.fn((value: number) => value.toString()),
}));

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [0, 1, 2],
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear">
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
    test("When given hoverIndex = -1 and day = 0, display is current values", () => {
        const weather = useWeather().weather;
        const unit = weather.getForecastUnit(view);

        const customDataPoints = dataPoints.map((point, i) => {
            if (i === weather.nowIndex) {
                return {
                    ...point,
                    y: [3, 4, 5],
                };
            }

            return point;
        });

        vi.mocked(useTooltip).mockReturnValue(-1);

        render(
            <Chart dataPoints={customDataPoints} type="linear">
                <TooltipDisplay day={0} view={view} />
            </Chart>
        );

        expect.soft(screen.queryByText(`Avg: 5${unit}`)).toBeInTheDocument();
        expect.soft(screen.queryByText(`Min 3 | Max 4`)).toBeInTheDocument();
        expect.soft(trunc).toHaveBeenCalledTimes(3);
    });

    test("Day > 0 and hoverIndex = -1 displays the low and high avg", () => {
        vi.mocked(useTooltip).mockReturnValue(-1);
        const weather = useWeather().weather;
        const unit = weather.getForecastUnit(view);

        render(
            <Wrapper>
                <TooltipDisplay day={1} view={view} />
            </Wrapper>
        );

        expect.soft(screen.queryByText("L: 2 H: 2")).toBeInTheDocument();
        if (unit !== "") expect.soft(screen.queryByText(`In Unit: ${unit}`)).toBeInTheDocument();
    });

    test("HoverIndex > -1", () => {
        const hoverIndex = 1;

        const weather = useWeather().weather;
        const unit = weather.getForecastUnit(view);

        vi.mocked(useTooltip).mockReturnValue(hoverIndex);

        render(
            <Wrapper>
                <TooltipDisplay day={0} view={view} />
            </Wrapper>
        );

        expect(screen.queryByText(`Avg: 2${unit}`)).toBeInTheDocument();
        expect.soft(screen.queryByText(`Min 0 | Max 1`)).toBeInTheDocument();
    });
});
