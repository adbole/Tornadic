import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Daily } from "Components";

import { mediaQueries } from "ts/StyleMixins";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
    render(<Daily />);
});

const matcher = /Now|Mon|Tue|Wed|Thu|Fri|Sun|Sat/;

test("renders 7 days of forecast", () => {
    expect.soft(screen.queryByText("7-Day Forecast")).toBeInTheDocument();

    const days = [...useWeather.useWeather().weather.getDailyValues()];

    days.forEach(day => {
        expect.soft(screen.queryByText(day.day)).toBeInTheDocument();
        expect
            .soft(screen.getAllByText(new RegExp(day.temperature_low.toString())).length)
            .toBeGreaterThan(0);
        expect
            .soft(screen.getAllByText(new RegExp(day.temperature_high.toString())).length)
            .toBeGreaterThan(0);
    });
});

test("foreach day clicked, it opens the chart modal to the temperature on said day", () => {
    const days = screen.getAllByText(matcher);

    days.forEach((day, i) => {
        act(() => {
            fireEvent.click(day);
        });

        expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
        expect.soft(screen.getByText<HTMLOptionElement>("Temperature").selected).toBeTruthy();
        expect.soft(screen.getAllByLabelText(/.+?/)[i]).toBeChecked();

        act(() => {
            screen.getByRole("dialog").dispatchEvent(new Event("cancel"));
        });

        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});

describe("Responsive", () => {
    test("By default, spans 2 rows and 2 columns", () => {
        expect
            .soft(screen.queryByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-column", "span 2");

        expect
            .soft(screen.queryByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-row", "span 2");
    });

    test("Down to medium, is in grid area d", () => {
        expect
            .soft(screen.queryByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-area", "d", { media: mediaQueries.min("medium") });
    });
});
