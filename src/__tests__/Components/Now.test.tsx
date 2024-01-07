import testIds from "__tests__/__constants__/testIDs";
import { apiWeatherGov_points } from "__tests__/__mocks__";
import useWeather from "__tests__/__mocks__/useWeather";
import { matchBrokenText, mockDate } from "__tests__/__utils__";
import { act, cleanup, render, screen } from "@testing-library/react";

import { Now } from "Components";

import { mediaQueries } from "ts/StyleMixins";


const location = apiWeatherGov_points.properties.relativeLocation.properties.city;

mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

test("Displays current weather information", () => {
    render(<Now />);

    expect.soft(screen.getByText(location)).toBeInTheDocument()
    expect.soft(screen.getByText("66")).toBeInTheDocument()
    expect.soft(screen.getByText("Partly Cloudy")).toBeInTheDocument()
    expect.soft(screen.getByText(matchBrokenText("Feels like 68"))).toBeInTheDocument()
})

test("Clicking on the location name opens the location modal", () => {
    render(<Now />);

    act(() => {
        screen.getByText(location).click()
    })

    expect(screen.getByRole("dialog")).toBeInTheDocument()

    cleanup()
})

test("Cliking on the gear opens the settings modal", () => {
    render(<Now />);

    act(() => {
        screen.getByRole("button").click()
    })
    
    expect(screen.getByRole("dialog")).toBeInTheDocument()
})

test("displayOnly hides the gear icon and disables the location modal", () => {
    render(<Now displayOnly={true} />);

    expect.soft(screen.queryByRole("button")).not.toBeInTheDocument()

    act(() => {
        screen.getByText(location).click()
    })

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()
})

describe("Responsive", () => {
    beforeEach(() => {
        render(<Now />)
    })

    test("Up to medium, takes up full width of grid", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-column", "1/-1", {  media: mediaQueries.max("medium") })
    })

    test("Down to medium, posititioned in area n", () => {
        expect(screen.getByTestId(testIds.Widget.WidgetSection))
            .toHaveStyleRule("grid-area", "n", {  media: mediaQueries.min("medium") })
    })
})