import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { ChartContext } from "Components/Modals/Chart/__internal__";
import Tooltip from "Components/Modals/Chart/__internal__/Tooltip";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

type TooltipInternalProps = {
    day: number
    hoverIndex: number
}

const mocks = vi.hoisted(() => {
    const mock = ({ day, hoverIndex }: TooltipInternalProps) => (JSON.stringify({ day, hoverIndex }))

    return {
        primary: vi.fn(mock),
        secondary: vi.fn(mock),
        time: vi.fn(mock)
    }
})

vi.mock("Components/Modals/Chart/__internal__/Tooltip/__internal__", () => ({
    PrimaryInformation: mocks.primary,
    SecondaryInformation: mocks.secondary,
    Time: mocks.time
}))

afterEach(() => {
    vi.clearAllMocks()
})

test.each([
    0, 1
])("No hover passes hoverindex -1 and day %i", (day) => {
    render(
        <ChartContext view="temperature_2m" day={day}>
            <Tooltip day={day} />
        </ChartContext>
    )

    const obj = JSON.stringify({ day, hoverIndex: -1 } as TooltipInternalProps)
    expect.soft(mocks.primary).toHaveLastReturnedWith(obj)
    expect.soft(mocks.secondary).toHaveLastReturnedWith(obj)
    expect.soft(mocks.time).toHaveLastReturnedWith(obj)
})

test.each([
    ["onMouseEnter, onMouseLeave", (element: SVGGElement) => {
        fireEvent.mouseEnter(element)
        fireEvent.mouseMove(element, { clientX: 100, clientY: 0 })
    }, (element: SVGGElement) => {
        fireEvent.mouseLeave(element)
    }],
    ["onTouchStart, onTouchEnd", (element: SVGGElement) => {
        fireEvent.touchStart(element)
        fireEvent.touchMove(element, { touches: [{ clientX: 100, clientY: 0 }] })
    }, (element: SVGGElement) => {
        fireEvent.touchEnd(element)
    }]
])(`%s causes the reference line to set its display and div to change item positions`, (_, triggerEvent, endEvent) => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Tooltip day={0} />
        </ChartContext>
    )

    const graph = container.querySelector("svg")!
    const referenceLine = container.querySelector("line")!

    expect.soft(referenceLine).toHaveStyle("display: none")

    act(() => {
        triggerEvent(graph)
    })

    expect.soft(referenceLine).toHaveStyle("display: block")
    expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: center")

    act(() => {
        endEvent(graph)
    })

    expect.soft(referenceLine).toHaveStyle("display: none")
    expect.soft(container.querySelector("svg div")).toHaveStyle("align-items: flex-start")
})

test("Hover passes a hoverIndex based on the mouse position", () => {
    const { container } = render(
        <ChartContext view="temperature_2m" day={0}>
            <Tooltip day={0} />
        </ChartContext>
    )

    const graph = container.querySelector("svg")!
    
    act(() => {
        fireEvent.mouseEnter(graph)
        fireEvent.mouseMove(graph, { clientX: 20, clientY: 0 })
    })

    const obj = JSON.stringify({ day: 0, hoverIndex: -1 } as TooltipInternalProps)
    expect.soft(mocks.primary).not.toHaveLastReturnedWith(obj)
    expect.soft(mocks.secondary).not.toHaveLastReturnedWith(obj)
    expect.soft(mocks.time).not.toHaveLastReturnedWith(obj)

    const returnedObj = mocks.primary.mock.results.slice(-1)[0].value

    act(() => {
        fireEvent.mouseEnter(graph)
        fireEvent.mouseMove(graph, { clientX: 30, clientY: 0 })
    })

    expect.soft(mocks.primary).not.toHaveLastReturnedWith(returnedObj)
    expect.soft(mocks.secondary).not.toHaveLastReturnedWith(returnedObj)
    expect.soft(mocks.time).not.toHaveLastReturnedWith(returnedObj)
})

test("If no data exists for a view on a day, then 'No Data' is displayed", () => {
    render(
        <ChartContext view="us_aqi" day={6}>
            <Tooltip day={6} />
        </ChartContext>
    )

    expect(screen.getByText("No Data")).toBeInTheDocument()
})

test.todo("Test for positioning of tooltip not possible, requires manual testing (vitest browser mode to automate?)")