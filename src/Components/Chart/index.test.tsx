import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { act, renderHook } from "@testing-library/react";

import Chart, { useChart } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const dataPoints = Array.from({ length: 24 }, (_, i) => ({
    x: new Date(i),
    y: [i],
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear">
            {children}
        </Chart>
    );
}

test("useChart gives the chart, x, y, dataPoints, and view", () => {
    const { result } = renderHook(useChart, { wrapper: Wrapper });

    const { chart, x, y, dataPoints: returnedPoints } = result.current;

    expect.soft(chart.node()).toBeTruthy();
    expect.soft(x).toBeTruthy();
    expect.soft(y).toBeTruthy();
    expect.soft(returnedPoints).toHaveLength(24);
    expect.soft(returnedPoints).toBe(dataPoints);
});

test("If the chart resizes, the scales and viewBox are updated", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
        width: 1000,
        height: 1000,
    } as DOMRect);

    const { result } = renderHook(useChart, { wrapper: Wrapper });

    const { chart, x: originalX, y: originalY } = result.current;
    expect.soft(chart.attr("viewBox")).toBe("0 0 1000 1000");

    vi.mocked(Element.prototype.getBoundingClientRect).mockReturnValue({
        width: 2000,
        height: 2000,
    } as DOMRect);

    act(() => {
        window.dispatchEvent(new Event("resize"));
    });

    const { x, y, dataPoints } = result.current;
    // 1 is used over 0 to ensure that the scale is actually updated
    // as x at 0 woudln't move since the margins don't change.
    const point = dataPoints[1];

    expect.soft(originalX(point.x)).not.toBe(x(point.x));
    expect.soft(originalY(point.y[0])).not.toBe(y(point.y[0]));
    expect.soft(chart.attr("viewBox")).toBe("0 0 2000 2000");
});

// test.each([
//     ["temperature_2m", "apparent_temperature"],
//     ["windspeed_10m", "windgusts_10m"],
// ] as [ChartViews, keyof CombinedHourly][])("View %s has y2 property %s", async (view, y2Prop) => {
//     function Wrapper({ children }: { children: React.ReactNode }) {
//         return (
//             <ChartContext view={view} day={0}>
//                 {children}
//             </ChartContext>
//         );
//     }

//     const {
//         result: {
//             current: { dataPoints },
//         },
//     } = renderHook(useChart, { wrapper: Wrapper });
//     const weather = useWeather().weather;

//     expect(dataPoints.map(point => point.y2)).toStrictEqual(
//         weather.getAllForecast(y2Prop).slice(0, 24)
//     );
// });

test("Type band uses band scale", async () => {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Chart dataPoints={dataPoints} type="band">
                {children}
            </Chart>
        );
    }

    const {
        result: {
            current: { x },
        },
    } = renderHook(useChart, { wrapper: Wrapper });

    expect((x as d3.ScaleBand<Date>).bandwidth).toBeTruthy();
    expect((x as d3.ScaleTime<number, number, never>).invert).toBeFalsy();
});
