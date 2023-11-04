import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Daily } from "Components";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings)
})

const matcher = /Now|Mon|Tue|Wed|Thu|Fri|Sun|Sat/

test("renders 7 days of forecast", () => {
    render(<Daily />);

    expect.soft(screen.getByText("7-Day Forecast")).toBeInTheDocument()

    const days = [...useWeather.useWeather().weather.getDailyValues()]
    
    days.forEach(day => {
        expect.soft(screen.getByText(day.day)).toBeInTheDocument()
        expect.soft(screen.getAllByText(new RegExp(day.temperature_low.toString())).length).toBeGreaterThan(0)
        expect.soft(screen.getAllByText(new RegExp(day.temperature_high.toString())).length).toBeGreaterThan(0)
    })
})

test("foreach day clicked, it opens the chart modal to the temperature on said day", () => {
    render(<Daily />);

    const days = screen.getAllByText(matcher)

    days.forEach((day, i) => {
        act(() => {
            fireEvent.click(day)
        })

        expect(screen.getByRole("dialog")).toBeInTheDocument()
        expect(screen.getByText<HTMLOptionElement>("Temperature").selected).toBeTruthy()
        expect(screen.getAllByLabelText(/.+?/)[i]).toBeChecked()

        act(() => {
            screen.getByRole("dialog").dispatchEvent(new Event("cancel"))
        })

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
})