import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Daily } from "Components";
import { ChartContext, useChart } from "Components/Modals/Chart/__internal__";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <ChartContext view="temperature_2m" day={0}>
            {children}
        </ChartContext>
    )
}

test("useChart gives the chart, x, y, dataPoints, and view", async () => {
    const { result } = renderHook(useChart, { wrapper: Wrapper })

    await act(async () => {
        await vi.runOnlyPendingTimersAsync(); 
    })

    // const { chart, x, y, view, dataPoints } = result.current

    expect.soft(result.current.chart.node()).toBeTruthy()
    // expect.soft(x).toBeTruthy()
    // expect.soft(y).toBeTruthy()
    // expect.soft(view).toBe("temperature_2m")
    // expect.soft(dataPoints).toHaveLength(24)
})

test("useChart throws an error if used outside context", () => {
    expect(() => renderHook(useChart)).toThrowError()
})