import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import { ChartContext } from "Components/Modals/Chart/__internal__";
import { PrimaryInformation } from "Components/Modals/Chart/__internal__/Tooltip/__internal__";


mockDate()

const mocks = vi.hoisted(() => ({ getLowHigh: vi.fn(() => "") }))

vi.mock("Contexts/WeatherContext", () => useWeather)
vi.mock(
    "Components/Modals/Chart/__internal__/Tooltip/__internal__/Helpers", 
    async (importOriginal) => ({
        ...(await importOriginal() as any),
        getLowHigh: mocks.getLowHigh
    })
)

test("When given hoverIndex -1 and day 0, mainInformation is current value", () => {
    render(
        <ChartContext view="temperature_2m" day={0}>
            <PrimaryInformation day={0} hoverIndex={-1} />
        </ChartContext>
    )

    expect(screen.getByText("65.6°")).toBeInTheDocument()
})

test("When given hoverIndex -1 and day > 0, mainInformation is provided by getLowHigh", () => {
    render(
        <ChartContext view="temperature_2m" day={1}>
            <PrimaryInformation day={3} hoverIndex={-1} />
        </ChartContext>
    )

    expect(mocks.getLowHigh).toBeCalledWith(expect.anything(), "temperature_2m", 3)
})

describe("HoverIndex tests", () => {
    test.each(Array(24).fill(null).map((_, i) => i))("HoverIndex %i", (hoverIndex) => {
        const weather = useWeather.useWeather().weather
        const value = weather.getForecast("temperature_2m", hoverIndex)
    
        render(
            <ChartContext view="temperature_2m" day={0}>
                <PrimaryInformation day={0} hoverIndex={hoverIndex} />
            </ChartContext>
        )
    
        expect(screen.getByText(`${value}°`)).toBeInTheDocument()
    })
})