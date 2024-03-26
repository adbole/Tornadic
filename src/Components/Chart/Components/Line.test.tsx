import { render } from "@testing-library/react";
import * as d3 from "d3";

import Chart from "../";

import { Line } from ".";


vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        line: vi.fn(original.line),
    };
});

const dataPoints = d3.range(24).map(i => ({
    x: new Date(i),
    y: [i, i * 2],
}));

test("Uses d3.line to create a line", () => {
    render(
        <Chart dataPoints={dataPoints} type="linear">
            <Line />
        </Chart>
    );

    expect(d3.line).toHaveBeenCalled();
});

test("Passes svg props to path", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Line stroke="red" strokeOpacity={0.5} />
        </Chart>
    );

    const path = container.querySelector("path");
    expect.soft(path).toHaveAttribute("stroke", "red");
    expect.soft(path).toHaveAttribute("stroke-opacity", "0.5");
});

test("Renders a path for yIndex = 0 by default", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Line />
        </Chart>
    );

    expect(container).toMatchSnapshot();
});

test("Renders a path for yIndex = 1", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="linear">
            <Line yIndex={1}/>
        </Chart>
    );

    expect(container).toMatchSnapshot();
});
