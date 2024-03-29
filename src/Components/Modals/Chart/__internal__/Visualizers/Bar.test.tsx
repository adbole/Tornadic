import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render } from "@testing-library/react";

import { ChartContext } from "../";

import { Bar } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

vi.mock("d3", async importOriginal => {
    const original = (await importOriginal()) as any;

    return {
        ...original,
        selection: vi.fn(original.selection),
    };
});

test("Passes svg props to group", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <Bar yProp="y1" fill="red" fillOpacity={0.5} />
        </ChartContext>
    );

    const group = container.querySelector("g");
    expect.soft(group).toHaveAttribute("fill", "red");
    expect.soft(group).toHaveAttribute("fill-opacity", "0.5");
});

test("Renders bars for y1 prop", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <Bar yProp="y1" />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});

test("Render fails if scale isn't a band scale", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() =>
        render(
            <ChartContext view="temperature_2m" day={0}>
                <Bar yProp="y1" />
            </ChartContext>
        )
    ).toThrow();

    vi.mocked(console.error).mockRestore();
});
