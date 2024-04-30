import { render } from "@testing-library/react";
import * as d3 from "d3";

import Chart from "../";

import { Area } from ".";


vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        area: vi.fn(original.area),
    };
});

const dataPoints = d3.range(24).map(i => ({
    x: new Date(i),
    y: [i, i * 2],
}));

test("Uses d3.area to create an area", () => {
    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Area />
        </Chart>
    );

    expect(d3.area).toHaveBeenCalled();
});

test("Passes svg props to path", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Area fill="red" fillOpacity={0.5} />
        </Chart>
    );

    const path = container.querySelector("path");
    expect.soft(path).toHaveAttribute("fill", "red");
    expect.soft(path).toHaveAttribute("fill-opacity", "0.5");
});

test("Renders a path for the yIndex = 0 by default", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Area />
        </Chart>
    );

    expect(container).toMatchSnapshot();
});

test("Renders a path for yIndex = 1", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Area yIndex={1} />
        </Chart>
    );

    expect(container).toMatchSnapshot();
});
