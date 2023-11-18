import { forecast } from "__tests__/__mocks__";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import { SunTime } from "Components";

import getTimeFormatted from "ts/TimeConversion";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

vi.mock("svgs/widget", () => ({
    Sunrise: () => <span>SunriseSVG</span>,
    Sunset: () => <span>SunsetSVG</span>,
}))

test("shows sunrise if the current time is before it", () => {
    vi.setSystemTime(forecast().daily.time[0]);

    render(<SunTime />);

    expect.soft(
        screen.getByRole("heading", { name: getTimeFormatted(forecast().daily.sunrise[0], "hourMinute") })
    ).toBeInTheDocument()
    expect.soft(screen.getByText("SunriseSVG")).toBeInTheDocument()
})

test("shows sunset if the current time is before it", () => {
    vi.setSystemTime(forecast().hourly.time[10]);

    render(<SunTime />);

    expect.soft(
        screen.getByRole("heading", { name: getTimeFormatted(forecast().daily.sunset[0], "hourMinute") })
    ).toBeInTheDocument()
    expect.soft(screen.getByText("SunsetSVG")).toBeInTheDocument()
})