import React from "react";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Hourly } from "Components";

import getTimeFormatted from "ts/TimeConversion";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings)
})

test("Displays hourly weather information", () => {
    render(<Hourly />);

    //48 hours + 2 seperators
    expect(screen.getAllByRole("listitem")).toHaveLength(50)
})

test("First item is the next hour", () => {
    render(<Hourly />);

    //If this breaks check getTimeFormatted tests or verify data
    const nextHour = getTimeFormatted(new Date(Date.now() + 60 * 60 * 1000), "hour");
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent(nextHour)
})

test("Displays the correct seperators", () => {
    render(<Hourly />);

    const today = new Date();
    const tomorrow = getTimeFormatted(new Date(today.getDate() + 1), "weekday");
    const afterTomorrow = getTimeFormatted(new Date(today.getDate() + 2), "weekday");

    //If this breaks check getTimeFormatted tests or verify data
    expect.soft(screen.getByText(tomorrow)).toBeInTheDocument()
    expect.soft(screen.getByText(afterTomorrow)).toBeInTheDocument()
})

describe("interaction tests", () => {
    test("clicking on the widget opens the chart modal to the temperature", () => {
        render(<Hourly />);

        act(() => {
            screen.getByRole("list").click()
        })

        expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
        expect.soft((screen.getByText("Temperature") as HTMLOptionElement).selected).toBeTruthy()
        expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked()
    })

    test("dragging causes the widget to scroll and doesn't open the chart modal", () => {
        render(<Hourly />);

        const element = screen.getByRole("list")

        expect.soft(element.scrollLeft).toBe(0)

        act(() => {
            fireEvent.mouseDown(element, { clientX: 0, clientY: 0 })
            fireEvent.mouseMove(element, { clientX: 100, clientY: 0 })
            fireEvent.mouseUp(element)
        })

        expect.soft(element.scrollLeft).toBeLessThan(0)
        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
})