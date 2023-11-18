import testIds from "__tests__/__constants__/testIDs";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import matchBrokenText from "__tests__/__utils__/matchBrokenText";
import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Wind } from "Components";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)
vi.mock("svgs/widget", () => ({ Wind: () => <span>WindSVG</span> }))

test("renders the current wind speed and direction", () => {
    const weather = useWeather.useWeather().weather

    render(<Wind />);

    expect.soft(screen.getByText(matchBrokenText("WindSVG Wind"))).toBeInTheDocument()
    expect.soft(screen.getByText(weather.getForecast("windspeed_10m").toFixed(0))).toBeInTheDocument()
    expect.soft(screen.getByText(weather.getForecastUnit("windspeed_10m"))).toBeInTheDocument()

    expect.soft(screen.getByTestId(testIds.Wind.WindIndicator))
        .toHaveStyle(`transform: rotate(${weather.getForecast("winddirection_10m") + 180}deg)`)
})

test("clicking the component opens the wind chart", () => {
    render(<Wind />);

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()

    act(() => {
        screen.getByTestId(testIds.Widget.WidgetSection).click()
    })

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(screen.getByRole<HTMLOptionElement>("option", { name: "Windspeed" } ).selected).toBeTruthy()
    expect.soft(screen.getAllByLabelText(/.+?/)[0]).toBeChecked()
})