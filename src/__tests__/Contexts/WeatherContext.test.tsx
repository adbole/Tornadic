import { setLocalStorageItem } from "__tests__/__utils__";
import { act, render, renderHook, screen } from "@testing-library/react"

import DEFAULTS from "Hooks/useLocalStorage.config";

import WeatherProvider, { useWeather } from "Contexts/WeatherContext"


const skeleton = "SKELETON";
const child = "CHILD";

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <WeatherProvider
            latitude={1}
            longitude={1}
            skeletonRender={() => <div data-testid={skeleton} />}
        >
            {children}
        </WeatherProvider>
    )
}

const renderWeather = () => renderHook(() => useWeather(), { wrapper: Wrapper })

beforeEach(() => {
    vi.useFakeTimers();
    setLocalStorageItem("userSettings", DEFAULTS.userSettings)
})

describe("render", () => {
    beforeEach(() => {
        render(<Wrapper><div data-testid={child} /></Wrapper>)
    })

    test("renders skeleton when loading without any data", () => {
        expect(screen.getByTestId(skeleton)).toBeInTheDocument()
    })

    test("child appears when data is loaded", async () => {
        await act(async () => {
            await vi.runOnlyPendingTimersAsync(); 
        })

        expect(screen.getByTestId(child)).toBeInTheDocument()
    })

    test("keeps skeleton up if any fetch throws", async () => {
        fetchMock.mockReject()

        render(<Wrapper><div data-testid={child} /></Wrapper>)

        await act(async () => {
            await vi.runOnlyPendingTimersAsync(); 
        })

        expect(screen.getByTestId(skeleton)).toBeInTheDocument()
    })

    test("keeps children up if any fetch throws during data update", async () => {        
        await act(async () => {
            await vi.runOnlyPendingTimersAsync(); 
        })

        fetchMock.mockReject()

        await act(async () => {
            await vi.runOnlyPendingTimersAsync(); 
        })

        expect(screen.getByTestId(child)).toBeInTheDocument()
    })
})

describe("hook", () => {
    test("throws error when used outside of provider", () => {
        expect(() => useWeather()).toThrowError()
    })

    test("returns the data when used inside provider", async () => {
        const { result } = renderWeather()

        await act(async () => {
            await vi.runOnlyPendingTimersAsync(); 
        })

        expect(result.current.weather).toBeTruthy()
    })

    test.todo("add radarAlertMode tests (requires mock data update for point and alerts)")
})