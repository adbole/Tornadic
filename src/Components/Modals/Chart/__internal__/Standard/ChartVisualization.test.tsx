import { useWeather } from "@test-mocks";
import { mockDate, setLocalStorageItem } from "@test-utils";

import { render } from "@testing-library/react";
import type { Mock } from "vitest";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Chart from "Components/Chart";

import type { ChartViews } from "../..";

import ChartVisualization from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const mocks = vi.hoisted(() => ({
    area: vi.fn(({ yIndex = 0 }: { yIndex?: number }) => yIndex),
    bar: vi.fn(({ yIndex = 0 }: { yIndex?: number }) => yIndex),
    line: vi.fn(({ yIndex = 0 }: { yIndex?: number }) => yIndex),
}));

vi.mock("Components/Chart/Components", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Area: mocks.area,
    Bar: mocks.bar,
    Line: mocks.line,
}));

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i],
}));

describe("Visualizer tests", () => {
    //[view, [y1Visuliazer, y2Visualizer], wrongVisualizers[]]
    test.each([
        ["temperature_2m", [mocks.area, mocks.line], [mocks.bar]],
        ["us_aqi", [mocks.area], [mocks.bar, mocks.line]],
        ["uv_index", [mocks.area], [mocks.bar, mocks.line]],
        ["precipitation", [mocks.bar], [mocks.area, mocks.line]],
        ["dewpoint_2m", [mocks.line], [mocks.area, mocks.bar]],
        ["relativehumidity_2m", [mocks.line], [mocks.area, mocks.bar]],
        ["windspeed_10m", [mocks.line, mocks.line], [mocks.area, mocks.bar]],
        ["surface_pressure", [mocks.line], [mocks.area, mocks.bar]],
        ["visibility", [mocks.line], [mocks.area, mocks.bar]],
    ] as [ChartViews, Mock[], Mock[]][])(
        "%s renders the correct visualizer(s)",
        (view, drawnVisualizers, wrongVisualizers) => {
            render(
                <Chart dataPoints={dataPoints} type={view === "precipitation" ? "band" : "linear"}>
                    <ChartVisualization view={view} day={0}/>
                </Chart>
            );

            expect.soft(drawnVisualizers[0]).toHaveReturnedWith(0);

            if (drawnVisualizers.length > 1)
                expect.soft(drawnVisualizers[1]).toHaveReturnedWith(1);

            drawnVisualizers.forEach(visualizer => expect.soft(visualizer).toHaveBeenCalled());
            wrongVisualizers.forEach(visualizer => expect.soft(visualizer).not.toHaveBeenCalled());
        }
    );
});

describe("Gradient tests", () => {
    test("When view is temperature_2m, gradient is created", () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);

        const { container } = render(
            <Chart dataPoints={dataPoints} type="linear">
                <ChartVisualization view="temperature_2m" day={0}/>
            </Chart>
        );

        expect(container).toMatchSnapshot();
    });

    test("When view is uv_index, gradient is created", () => {
        const { container } = render(
            <Chart dataPoints={dataPoints} type="linear">
                <ChartVisualization view="uv_index" day={0}/>
            </Chart>
        );

        expect(container).toMatchSnapshot();
    });

    test("When view is us_aqi, gradient is created", () => {
        const { container } = render(
            <Chart dataPoints={dataPoints} type="linear">
                <ChartVisualization view="us_aqi" day={0}/>
            </Chart>
        );

        expect(container).toMatchSnapshot();
    });
});
