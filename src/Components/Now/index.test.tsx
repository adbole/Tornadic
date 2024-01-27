import testIds from "@test-consts/testIDs";
import { apiWeatherGov_points, useWeather } from "@test-mocks";
import { matchBrokenText, mockDate } from "@test-utils";

import { act, cleanup, render, screen } from "@testing-library/react";

import { mediaQueries } from "ts/StyleMixins";

import Now from ".";


const location = apiWeatherGov_points.properties.relativeLocation.properties.city;

mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

test("Displays current weather information", () => {
    render(<Now />);

    expect.soft(screen.queryByText(location)).toBeInTheDocument();
    expect.soft(screen.queryByText("66")).toBeInTheDocument();
    expect.soft(screen.queryByText("Partly Cloudy")).toBeInTheDocument();
    expect.soft(screen.queryByText(matchBrokenText("Feels like 68"))).toBeInTheDocument();
});

test("Clicking on the location name opens the location modal", () => {
    render(<Now />);

    act(() => {
        screen.getByText(location).click();
    });

    expect.soft(screen.getByText(location)).toHaveStyle({ cursor: "pointer" });
    expect.soft(screen.getByRole("dialog")).toBeInTheDocument();

    cleanup();
});

test("Cliking on the gear opens the settings modal", () => {
    render(<Now />);

    act(() => {
        screen.getByRole("button").click();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("displayOnly hides the gear icon and disables the location modal", () => {
    render(<Now displayOnly={true} />);

    expect.soft(screen.queryByRole("button")).not.toBeInTheDocument();
    expect.soft(screen.getByText(location)).not.toHaveStyle({ cursor: "pointer" });

    act(() => {
        screen.getByText(location).click();
    });

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

describe("Responsive", () => {
    beforeEach(() => {
        render(<Now />);
    });

    test("Up to medium, takes up full width of grid", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule(
            "grid-column",
            "1/-1",
            { media: mediaQueries.max("medium") }
        );
    });

    test("Down to medium, posititioned in area n within root", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule("grid-area", "n", {
            target: "#root>",
            media: mediaQueries.min("medium"),
        });
    });
});
