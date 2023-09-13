import { renderHook } from "@testing-library/react";
import type { FetchMock } from "vitest-fetch-mock"

import { useOpenMeteo } from "Hooks";
import DEFAULTS from "Hooks/useLocalStorage.config";


beforeAll(() => {
    localStorage.setItem("userSettings", JSON.stringify(DEFAULTS.userSettings))
    vi.useFakeTimers()
})

afterAll(() => {
    vi.runAllTimers()
    vi.useRealTimers()
})

test("Makes api calls to open-meteo with lat and long", async () => {
    renderHook(() => useOpenMeteo(0, 0))

    const requests = (fetch as FetchMock).requests().map(v => v.url)
    expect.soft(requests[0]).toMatch(/^https:\/\/api.open-meteo.com(.*?)latitude=0(.*?)longitude=0(.*?)$/)
    expect.soft(requests[1]).toMatch(/^https:\/\/air-quality-api.open-meteo.com(.*?)latitude=0(.*?)longitude=0(.*?)$/)
})

test("It creates a weather object", async () => {
    const { result } = renderHook(() => useOpenMeteo(0, 0))
    
    expect.soft(result.current.isLoading).toBe(false)
    expect.soft(result.current.weather).not.toBe(undefined)
    
    //See Weather.test.ts for verification of the weather object's values given a response
})

test("It refreshes data at the next hour", async () => {
    renderHook(() => useOpenMeteo(0, 0))

    expect.soft(fetch).toBeCalledTimes(2)
    vi.advanceTimersByTime(3.6e6)
    expect.soft(fetch).toBeCalledTimes(4)
})