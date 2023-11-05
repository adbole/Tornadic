import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import { HazardLevel } from "Components";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

vi.mock("svgs/conditions", () => ({ Sun: () => <p>Sun</p> }))
vi.mock("svgs/widget", () => ({ Lungs: () => <p>Lungs</p> }))

//Due to a limitation with jsdom, gradient backgrounds cannot be tested

test("renders airquality", () => {
    const weather = useWeather.useWeather().weather

    render(<HazardLevel hazard="us_aqi"/>);

    expect.soft(screen.getByText(/Air Quality/)).toBeInTheDocument()
    expect.soft(screen.getByText(/Lungs/)).toBeInTheDocument()
    expect.soft(screen.getByText(weather.getForecast("us_aqi").toFixed(0))).toBeInTheDocument()

    expect.soft(screen.getByTestId(testIds.HazardLevel.SVG_GROUP))
        .toHaveStyle("transform: rotate(48.16deg)")
})

test("renders uv index", () => {
    const weather = useWeather.useWeather().weather

    render(<HazardLevel hazard="uv_index"/>);

    expect.soft(screen.getByText(/UV Index/)).toBeInTheDocument()
    expect.soft(screen.getByText(/Sun/)).toBeInTheDocument()
    expect.soft(screen.getByText(weather.getForecast("uv_index").toFixed(0))).toBeInTheDocument()

    expect.soft(screen.getByTestId(testIds.HazardLevel.SVG_GROUP))
        .toHaveStyle("transform: rotate(20deg)")
})