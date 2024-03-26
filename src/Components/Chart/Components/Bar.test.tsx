import { render } from "@testing-library/react";
import * as d3 from "d3";

import Chart from "../";

import { Bar } from ".";


vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        selection: vi.fn(original.selection),
    };
});

const dataPoints = d3.range(24).map(i => ({
    x: new Date(i),
    y: [i],
}));

test("Passes svg props to group", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="band">
            <Bar fill="red" fillOpacity={0.5} />
        </Chart>
    );

    const group = container.querySelector("g");
    expect.soft(group).toHaveAttribute("fill", "red");
    expect.soft(group).toHaveAttribute("fill-opacity", "0.5");
});

test("Renders bars for yIndex = 0 by default", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="band">
            <Bar />
        </Chart>
    );

    expect(container).toMatchSnapshot();
});

test("Render fails if scale isn't a band scale", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() =>
        render(
            <Chart dataPoints={dataPoints} type="linear">
                <Bar />
            </Chart>
        )
    ).toThrow();

    vi.mocked(console.error).mockRestore();
});
