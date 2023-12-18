import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import type { ChartViews } from "Components/Modals/Chart";
import { ChartContext } from "Components/Modals/Chart/__internal__";
import { PrimaryInformation } from "Components/Modals/Chart/__internal__/Tooltip/__internal__";
import * as TooltipHelpers from "Components/Modals/Chart/__internal__/Tooltip/__internal__/Helpers";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

beforeEach(() => {
    vi.clearAllMocks()
})

describe.each([
    "dewpoint_2m",
    "precipitation",
    "relativehumidity_2m",
    "surface_pressure",
    "temperature_2m",
    "us_aqi",
    "uv_index",
    "visibility",
    "windspeed_10m"
] as Array<ChartViews>)
("Given view %s", (view) => {
    beforeAll(() => {
        vi.spyOn(TooltipHelpers, "getLowHigh")    
    })

    test("When given hoverIndex -1 and day 0, mainInformation is current value", () => {
        const weather = useWeather.useWeather().weather
        const value = TooltipHelpers.trunc(weather.getForecast(view))
        const unit = weather.getForecastUnit(view)

        render(
            <ChartContext view={view} day={0}>
                <PrimaryInformation day={0} hoverIndex={-1} />
            </ChartContext>
        )

        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument()
    })

    test("Day > 0 and hoverIndex = -1 uses getLowHigh", () => {        
        render(
            <ChartContext view={view} day={1}>
                <PrimaryInformation day={1} hoverIndex={-1} />
            </ChartContext>
        )

        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledOnce()
        expect.soft(TooltipHelpers.getLowHigh).toHaveBeenCalledWith(expect.anything(), view, 1)
    })

    test("HoverIndex > -1", () => {
        const weather = useWeather.useWeather().weather
        const value = TooltipHelpers.trunc(weather.getForecast(view, 1))
        const unit = weather.getForecastUnit(view)
    
        render(
            <ChartContext view={view} day={0}>
                <PrimaryInformation day={0} hoverIndex={1} />
            </ChartContext>
        )
    
        expect(screen.getByText(`${value}${unit}`)).toBeInTheDocument()
    })
})