import { airQualityOpenMeteo, apiOpenMeteo, apiWeatherGov_alerts, apiWeatherGov_points } from "__tests__/__mocks__";
import { mockDate } from "__tests__/__utils__";
import { act, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Now } from "Components";

import NWSAlert from "ts/NWSAlert";
import Weather from "ts/Weather";


const location = apiWeatherGov_points.properties.relativeLocation.properties.city;

mockDate()

vi.mock("Contexts/WeatherContext", async (importOriginal) => {
    return {
        ...[await importOriginal()],
        useWeather: () => ({
            weather: new Weather(apiOpenMeteo, airQualityOpenMeteo, DEFAULTS.userSettings),
            point: apiWeatherGov_points as GridPoint,
            alerts: apiWeatherGov_alerts.features.map(alert => new NWSAlert(alert)),
            nationAlerts: apiWeatherGov_alerts.features.map(alert => new NWSAlert(alert))
        })
    }
})

test("Displays current weather information", () => {
    render(<Now />);

    expect.soft(screen.getByText(location)).toBeInTheDocument()
    expect.soft(screen.getByText("66")).toBeInTheDocument()
    expect.soft(screen.getByText("Partly Cloudy")).toBeInTheDocument()
    expect.soft(screen.getByText((_, element) => {
        const matchText = "Feels like 68"

        const hasText = element!.textContent!.includes(matchText)
        const childrenHaveText = [...element!.children].some(child => child.textContent!.includes(matchText))

        return hasText && !childrenHaveText;
    })).toBeInTheDocument()
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

test("Display only hides the gear icon and disables the location modal", () => {
    render(<Now displayOnly={true} />);

    expect.soft(screen.queryByRole("button")).not.toBeInTheDocument()

    act(() => {
        screen.getByText(location).click()
    })

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()
})