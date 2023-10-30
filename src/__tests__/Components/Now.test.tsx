import { apiWeatherGov_points } from "__tests__/__mocks__";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import matchBrokenText from "__tests__/__utils__/matchBrokenText";
import { act, render, screen } from "@testing-library/react";

import { Now } from "Components";


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