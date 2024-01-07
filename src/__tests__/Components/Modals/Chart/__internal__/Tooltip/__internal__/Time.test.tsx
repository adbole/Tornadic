import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import { ChartContext } from "Components/Modals/Chart/__internal__";
import { Time } from "Components/Modals/Chart/__internal__/Tooltip/__internal__";

import getTimeFormatted from "ts/TimeConversion";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

test("When given hoverIndex -1 and day 0, shows Now", () => {
    render(
        <ChartContext view="temperature_2m" day={0}>
            <Time day={0} hoverIndex={-1} />
        </ChartContext>
    );

    expect(screen.getByText("Now")).toBeInTheDocument();
});

test("Shows 'Min and Max' when given day > 0", () => {
    render(
        <ChartContext view="temperature_2m" day={1}>
            <Time day={1} hoverIndex={-1} />
        </ChartContext>
    );

    expect(screen.getByText("Min and Max")).toBeInTheDocument();
});

test("Shows time when given hoverIndex > -1", () => {
    const weather = useWeather.useWeather().weather;
    const time = getTimeFormatted(weather.getForecast("time", 1), "hourMinute");

    render(
        <ChartContext view="temperature_2m" day={0}>
            <Time day={0} hoverIndex={1} />
        </ChartContext>
    );

    expect(screen.getByText(time)).toBeInTheDocument();
});
