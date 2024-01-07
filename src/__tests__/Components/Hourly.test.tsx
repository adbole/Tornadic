import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Hourly } from "Components";
import AlertWidget from "Components/Alert/style"

import { mediaQueries } from "ts/StyleMixins";
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
    expect.soft(screen.queryByText(tomorrow)).toBeInTheDocument()
    expect.soft(screen.queryByText(afterTomorrow)).toBeInTheDocument()
})

describe("interaction tests", () => {
    test("clicking on the widget opens the chart modal to the temperature", () => {
        render(<Hourly />);

        act(() => {
            screen.getByRole("list").click()
        })

        expect.soft(screen.queryByRole("dialog")).toBeInTheDocument()
        expect.soft(screen.getByText<HTMLOptionElement>("Temperature").selected).toBeTruthy()
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

describe("Responsive", () => {
    beforeEach(() => {
        render(<Hourly />);
    })

    test("By default the widget spans 2", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-column", "span 2")
    })

    test("Down to large, the widget spans 6", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-column", "span 6", { media: mediaQueries.min("large") })
    })

    test("Down to large, the widget spans 4 if the alert widget precedes it", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-column", "span 4", { 
                target: `${AlertWidget}+`,
                media: mediaQueries.min("large") 
            })
    })
})