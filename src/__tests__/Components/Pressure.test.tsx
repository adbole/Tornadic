import { forecast } from "__tests__/__mocks__";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { act, render, screen } from "@testing-library/react";

import { Pressure } from "Components";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

vi.mock("svgs/widget", () => ({
    Down: () => <span>Down</span>,
    Meter: () => <span>Meter</span>,
    Up: () => <span>Up</span>,
}))

test("clicking on the widget opens the chart modal to the pressure", () => {
    render(<Pressure />);

    act(() => {
        screen.getByRole("heading").click()
    })

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(screen.getByText<HTMLOptionElement>("Pressure").selected).toBeTruthy()
    expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked()
})

test("Shows the current pressure", () => {
    const weather = useWeather.useWeather().weather
    render(<Pressure />);

    expect.soft(screen.getByText("Meter")).toBeInTheDocument()
    expect.soft(screen.getByText("Air Pressure")).toBeInTheDocument()

    expect.soft(screen.getByText(weather.getForecast("surface_pressure").toFixed(2))).toBeInTheDocument()
    expect.soft(screen.getByText(weather.getForecastUnit("surface_pressure"))).toBeInTheDocument()
})

describe("shows the pressure trend", () => {
    test("Equal", () => {
        render(<Pressure />);

        expect.soft(screen.getByText("=")).toBeInTheDocument()
    })

    test("Down", () => {
        vi.setSystemTime(forecast().hourly.time[16]);
        render(<Pressure />);

        expect.soft(screen.getByText("Down")).toBeInTheDocument()
    })

    test("Up", () => {
        vi.setSystemTime(forecast().hourly.time[20]);

        render(<Pressure />);

        expect.soft(screen.getByText("Up")).toBeInTheDocument()
    })
})