import { useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render } from "@testing-library/react";

import { ChartContext, NowReference } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

test("When shown, draws a rect and line to the current time", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <NowReference isShown />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});

test("When shown, gives a offset for bandWidth", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <NowReference isShown />
        </ChartContext>
    );

    expect(container).toMatchSnapshot();
});

test("When not shown, returns null", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <NowReference isShown={false} />
        </ChartContext>
    );

    expect(container.querySelector("svg")).toBeEmptyDOMElement();
});
