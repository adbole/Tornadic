import { forecast, useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import { render } from "@testing-library/react";

import Chart from "Components/Chart";

import { NowReference } from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

const dataPoints = forecast().hourly.time.slice(0, 24).map((iso, i) => ({ 
    x: new Date(iso), 
    y: [i] 
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <Chart dataPoints={dataPoints} type="linear">
            {children}
        </Chart>
    );
}

test("When shown, draws a rect and line to the current time", () => {
    const { container } = render(
        <Wrapper>
            <NowReference isShown />
        </Wrapper>
    );

    expect(container).toMatchSnapshot();
});

test("When shown, gives a offset for bandWidth", () => {
    const { container } = render(
        <Chart dataPoints={dataPoints} type="band">
            <NowReference isShown />
        </Chart>
    );

    expect(container).toMatchSnapshot();
});

test("When not shown, returns null", () => {
    const { container } = render(
        <Wrapper>
            <NowReference isShown={false} />
        </Wrapper>
    );

    expect(container.querySelector("svg")).toBeEmptyDOMElement();
});
