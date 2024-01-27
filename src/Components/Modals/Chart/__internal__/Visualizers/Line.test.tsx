import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render } from "@testing-library/react";
import * as d3 from "d3";

import { ChartContext } from "../";

import { Line } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        line: vi.fn(original.line),
    };
});

test("Uses d3.line to create a line", () => {
    render(
        <ChartContext view="temperature_2m" day={0}>
            <Line yProp="y1" />
        </ChartContext>
    );

    expect(d3.line).toHaveBeenCalled();
});

test("Passes svg props to path", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Line yProp="y1" stroke="red" strokeOpacity={0.5} />
        </ChartContext>
    );

    const path = container.querySelector("path");
    expect.soft(path).toHaveAttribute("stroke", "red");
    expect.soft(path).toHaveAttribute("stroke-opacity", "0.5");
});

test("Renders a path for y1 prop", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Line yProp="y1" />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});

test("Renders a path for y2 prop", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Line yProp="y2" />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});
