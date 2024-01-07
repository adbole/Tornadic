import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render } from "@testing-library/react";
import * as d3 from "d3";

import { ChartContext } from "Components/Modals/Chart/__internal__";
import { Area } from "Components/Modals/Chart/__internal__/Visualizers";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        area: vi.fn(original.area),
    };
});

test("Uses d3.area to create an area", () => {
    render(
        <ChartContext view="temperature_2m" day={0}>
            <Area yProp="y1" />
        </ChartContext>
    );

    expect(d3.area).toHaveBeenCalled();
});

test("Passes svg props to path", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Area yProp="y1" fill="red" fillOpacity={0.5} />
        </ChartContext>
    );

    const path = container.querySelector("path");
    expect.soft(path).toHaveAttribute("fill", "red");
    expect.soft(path).toHaveAttribute("fill-opacity", "0.5");
});

test("Renders a path for y1 prop", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Area yProp="y1" />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});

test("Renders a path for y2 prop", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Area yProp="y2" />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});
