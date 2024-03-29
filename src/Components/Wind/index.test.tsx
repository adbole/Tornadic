import testIds from "@test-consts/testIDs";
import { useWeather } from "@test-mocks";
import { matchBrokenText, mockDate } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import Wind from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));
vi.mock("svgs/widget", () => ({ Wind: () => <span>WindSVG</span> }));

test("renders the current wind speed and direction", () => {
    const weather = useWeather().weather;

    render(<Wind />);

    expect.soft(screen.queryByText(matchBrokenText("WindSVG Wind"))).toBeInTheDocument();
    expect
        .soft(screen.queryByText(weather.getForecast("windspeed_10m").toFixed(0)))
        .toBeInTheDocument();
    expect.soft(screen.queryByText(weather.getForecastUnit("windspeed_10m"))).toBeInTheDocument();

    expect
        .soft(screen.queryByTestId(testIds.Wind.WindIndicator))
        .toHaveStyle(`transform: rotate(${weather.getForecast("winddirection_10m") + 180}deg)`);
});

test("clicking the component opens the wind chart", () => {
    render(<Wind />);

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
        screen.getByTestId(testIds.Widget.WidgetSection).click();
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect
        .soft(screen.getByRole<HTMLOptionElement>("option", { name: "Windspeed" }).selected)
        .toBeTruthy();
    expect.soft(screen.queryAllByLabelText(/.+?/)[0]).toBeChecked();
});
