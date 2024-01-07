import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { act, render, screen } from "@testing-library/react";

import { HazardLevel } from "Components";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

vi.mock("svgs/conditions", () => ({ Sun: () => <p>Sun</p> }));
vi.mock("svgs/widget", () => ({ Lungs: () => <p>Lungs</p> }));

//Due to a limitation with jsdom, gradient backgrounds cannot be tested

test("renders airquality", () => {
    const weather = useWeather.useWeather().weather;

    render(<HazardLevel hazard="us_aqi" />);

    expect.soft(screen.queryByText(/Air Quality/)).toBeInTheDocument();
    expect.soft(screen.queryByText(/Lungs/)).toBeInTheDocument();
    expect.soft(screen.queryByText(weather.getForecast("us_aqi").toFixed(0))).toBeInTheDocument();

    expect
        .soft(screen.queryByTestId(testIds.HazardLevel.SVG_GROUP))
        .toHaveStyle("transform: rotate(48.16deg)");
});

test("shows the airquality chart if clicked", () => {
    render(<HazardLevel hazard="us_aqi" />);

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
        screen.getByTestId(testIds.Widget.WidgetSection).click();
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect
        .soft(screen.getByRole<HTMLOptionElement>("option", { name: "Air Quality" }).selected)
        .toBeTruthy();
    expect.soft(screen.queryAllByLabelText(/.+?/)[0]).toBeChecked();
});

test("renders uv index", () => {
    const weather = useWeather.useWeather().weather;

    render(<HazardLevel hazard="uv_index" />);

    expect.soft(screen.queryByText(/UV Index/)).toBeInTheDocument();
    expect.soft(screen.queryByText(/Sun/)).toBeInTheDocument();
    expect.soft(screen.queryByText(weather.getForecast("uv_index").toFixed(0))).toBeInTheDocument();

    expect
        .soft(screen.queryByTestId(testIds.HazardLevel.SVG_GROUP))
        .toHaveStyle("transform: rotate(20deg)");
});

test("shows the uv index chart if clicked", () => {
    render(<HazardLevel hazard="uv_index" />);

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
        screen.getByTestId(testIds.Widget.WidgetSection).click();
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect
        .soft(screen.getByRole<HTMLOptionElement>("option", { name: "UV Index" }).selected)
        .toBeTruthy();
    expect.soft(screen.queryAllByLabelText(/.+?/)[0]).toBeChecked();
});
