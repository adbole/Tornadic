import testIds from "@test-consts/testIDs";
import { useWeather } from "@test-mocks";
import { mockDate, setLocalStorageItem, userTest } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Hourly } from "Components";
import AlertWidget from "Components/Alert/style";

import { mediaQueries } from "ts/StyleMixins";
import getTimeFormatted from "ts/TimeConversion";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
});

test("Displays hourly weather information", () => {
    render(<Hourly />);

    //48 hours + 2 seperators
    expect(screen.getAllByRole("listitem")).toHaveLength(50);
});

test("First item is the next hour", () => {
    render(<Hourly />);

    //If this breaks check getTimeFormatted tests or verify data
    const nextHour = getTimeFormatted(new Date(Date.now() + 60 * 60 * 1000), "hour");
    expect(screen.getAllByRole("listitem")[0]).toHaveTextContent(nextHour);
});

test("Displays the correct seperators", () => {
    render(<Hourly />);

    const today = new Date();
    const tomorrow = getTimeFormatted(new Date(today.getDate() + 1), "weekday");
    const afterTomorrow = getTimeFormatted(new Date(today.getDate() + 2), "weekday");

    //If this breaks check getTimeFormatted tests or verify data
    expect.soft(screen.queryByText(tomorrow)).toBeInTheDocument();
    expect.soft(screen.queryByText(afterTomorrow)).toBeInTheDocument();
});

describe("interaction tests", () => {
    userTest("clicking on the widget opens the chart modal to the temperature", async ({ user }) => {
        render(<Hourly />);

        await user.click(screen.getByRole("list"))

        expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
        expect.soft(screen.getByText<HTMLOptionElement>("Temperature").selected).toBeTruthy();
        expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked();
    });

    test("dragging causes the widget to scroll and doesn't open the chart modal", () => {
        render(<Hourly />);

        const element = screen.getByRole("list");

        expect.soft(element.scrollLeft).toBe(0);

        act(() => {
            fireEvent.mouseDown(element, { clientX: 0, clientY: 0 });
            fireEvent.mouseMove(element, { clientX: 100, clientY: 0 });
            fireEvent.mouseUp(element);
        });

        expect.soft(element.scrollLeft).toBeLessThan(0);
        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});

describe("Responsive", () => {
    beforeEach(() => {
        render(<Hourly />);
    });

    test("By default the widget spans 2", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule(
            "grid-column",
            "span 2"
        );
    });

    describe.each([
        ["large", 6, 4],
        ["small", 4, 2],
    ] as [Parameters<typeof mediaQueries.min>[0], number, number][])(
        "Down to %s",
        (size, normalSize, alertSize) => {
            test(`Widget spans ${normalSize}`, () => {
                expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule(
                    "grid-column",
                    `span ${normalSize}`,
                    { media: mediaQueries.min(size) }
                );
            });

            test(`Widget spans ${alertSize} if preceded by an alert`, () => {
                expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule(
                    "grid-column",
                    `span ${alertSize}`,
                    {
                        target: `${AlertWidget}+`,
                        media: mediaQueries.min(size),
                    }
                );
            });
        }
    );
});
