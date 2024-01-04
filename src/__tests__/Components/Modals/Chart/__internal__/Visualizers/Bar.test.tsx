import useWeather from "__tests__/__mocks__/useWeather"
import { mockDate } from "__tests__/__utils__"
import { render } from "@testing-library/react"

import { ChartContext } from "Components/Modals/Chart/__internal__"
import { Bar } from "Components/Modals/Chart/__internal__/Visualizers"


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

vi.mock("d3", async (importOriginal) => {
    const original = await importOriginal() as any

    return {
        ...original,
        selection: vi.fn(original.selection)
    }
})

test("Passes svg props to group", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <Bar yProp="y1" fill="red"  fillOpacity={0.5}/> 
        </ChartContext>
    )

    const group = container.querySelector("g")
    expect.soft(group).toHaveAttribute("fill", "red")
    expect.soft(group).toHaveAttribute("fill-opacity", "0.5")
})

test("Renders bars for y1 prop", () => {
    const { container } = render(
        <ChartContext view="precipitation" day={0}>
            <Bar yProp="y1" /> 
        </ChartContext>
    )

    expect(container).toMatchSnapshot()
})

test("Render fails if scale isn't a band scale", () => {
    expect(() => (
        render(
            <ChartContext view="temperature_2m" day={0}>
                <Bar yProp="y1" /> 
            </ChartContext>
        )
    )).toThrow()
})