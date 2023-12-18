import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { render } from "@testing-library/react";
import type { Mock } from "vitest";

import DEFAULTS from "Hooks/useLocalStorage.config";

import type { ChartViews } from "Components/Modals/Chart";
import { ChartContext, ChartVisualization } from "Components/Modals/Chart/__internal__";
import type { YProp } from "Components/Modals/Chart/__internal__/Visualizers/index.types";

import * as Helpers from "ts/Helpers";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

const mocks = vi.hoisted(() => ({
    area: vi.fn(({ yProp }: { yProp: YProp }) => yProp),
    bar: vi.fn(({ yProp }: { yProp: YProp }) => yProp),
    line: vi.fn(({ yProp }: { yProp: YProp }) => yProp)
}))

vi.mock("Components/Modals/Chart/__internal__/Visualizers", () => ({
    Area: mocks.area,
    Bar: mocks.bar,
    Line: mocks.line
}))

afterEach(() => {
    mocks.area.mockClear()
    mocks.bar.mockClear()
    mocks.line.mockClear()
})

describe("Visualizer tests", () => {
    //[view, [y1Visuliazer, y2Visualizer], wrongVisualizers[]]
    test.each(
        [
            ["temperature_2m", [mocks.area, mocks.line], [mocks.bar]],
            ["us_aqi", [mocks.area], [mocks.bar, mocks.line]],
            ["uv_index", [mocks.area], [mocks.bar, mocks.line]],
            ["precipitation", [mocks.bar], [mocks.area, mocks.line]],
            ["dewpoint_2m", [mocks.line], [mocks.area, mocks.bar]],
            ["relativehumidity_2m", [mocks.line], [mocks.area, mocks.bar]],
            ["windspeed_10m", [mocks.line, mocks.line], [mocks.area, mocks.bar]],
            ["surface_pressure", [mocks.line], [mocks.area, mocks.bar]],
            ["visibility", [mocks.line], [mocks.area, mocks.bar]]

        ] as [ChartViews, Mock[], Mock[]][]
    )("%s renders the correct visualizer(s)", (view, drawnVisualizers, wrongVisualizers) => {
        render(
            <ChartContext view={view} day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect.soft(drawnVisualizers[0]).toHaveReturnedWith("y1")
        
        if(drawnVisualizers.length > 1) 
            expect.soft(drawnVisualizers[1]).toHaveReturnedWith("y2")

        drawnVisualizers.forEach(visualizer => expect.soft(visualizer).toHaveBeenCalled())
        wrongVisualizers.forEach(visualizer => expect.soft(visualizer).not.toHaveBeenCalled())
    })
})

describe("Gradient tests", () => {
    test("When view is temperature_2m, gradient is created", () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings)

        const { container } = render(
            <ChartContext view="temperature_2m" day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect(container).toMatchSnapshot()
    })

    test("When view is uv_index, gradient is created", () => {
        const { container } = render(
            <ChartContext view="uv_index" day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect(container).toMatchSnapshot()
    })

    test("When view is us_aqi, gradient is created", () => {
        const { container } = render(
            <ChartContext view="us_aqi" day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect(container).toMatchSnapshot()
    })

    test("When get_uv returns Extreme, gradient falls through all values", () => {
        vi.spyOn(Helpers, "get_uv").mockReturnValue("Extreme")

        const { container } = render(
            <ChartContext view="uv_index" day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect.soft(container.querySelectorAll("stop")).toHaveLength(5)
        expect.soft(container).toMatchSnapshot()
    })

    test("When get_aqi returns Hazardous, gradient falls through all values", () => {
        vi.spyOn(Helpers, "get_aq").mockReturnValue("Hazardous")

        const { container } = render(
            <ChartContext view="us_aqi" day={0}>
                <ChartVisualization />
            </ChartContext>
        )

        expect.soft(container.querySelectorAll("stop")).toHaveLength(6)
        expect.soft(container).toMatchSnapshot()
    })
})