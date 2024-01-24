import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate, setLocalStorageItem } from "__tests__/__utils__";
import { render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Background } from "Components";

import Weather from "ts/Weather";
import type WeatherCondition from "ts/WeatherCondition";


mockDate()

vi.mock("Contexts/WeatherContext", () => useWeather)

type DayCondition = {
    isDay: boolean,
    condition: string
}

type Condition = {
    condition: string
}

const mocks = vi.hoisted(() => ({
    Sky: vi.fn(() => <div>Sky</div>),
    Canvas: vi.fn(({ children, className, style, fallback }: { 
        children: React.ReactNode, 
        className: string, 
        style: React.CSSProperties,
        fallback: React.ReactNode,
    }) => (
        <div className={className} style={style}>Canvas - {children} - {fallback}</div>
    ))
}))

vi.mock("@react-three/drei", () => ({
    Sky: mocks.Sky
}))

vi.mock("@react-three/fiber", () => ({
    Canvas: mocks.Canvas
}))

vi.mock("Components/Background/__internal__", () => ({
    Clouds: ({ isDay, condition }: DayCondition) => <div>Clouds - {isDay.toString()} - {condition}</div>,
    Gradient: ({ isDay, condition }: DayCondition) => <div>Gradient - {isDay.toString()} - {condition}</div>,
    Stars: ({ isDay, condition }: DayCondition) => <div>Stars - {isDay.toString()} - {condition}</div>,
    RainSnow: ({ condition }: Condition) => <div>RainSnow - {condition}</div>,
    Thunder: ({ condition }: Condition) => <div>Thunder - {condition}</div>,
}))

beforeEach(() => {
    vi.spyOn(Weather.prototype, "isDay").mockReturnValue(true)
    vi.spyOn(Weather.prototype, "getNow").mockReturnValue({
        conditionInfo: {
            type: "Clear"
        }
    } as any)
})

afterEach(() => {
    vi.mocked(Weather.prototype.isDay).mockRestore()
    vi.mocked(Weather.prototype.getNow).mockRestore()
})


test("Renders the correct components", () => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings)
    
    render(<Background />)

    const canvas = screen.queryByText(/Canvas/)

    expect(canvas).toBeInTheDocument()
    expect.soft(canvas).toMatchSnapshot()
})

describe("Gradient Fallback", () => {
    test("If there are no userSettings", () => {
        render(<Background />)

        expect.soft(screen.queryByText("Gradient - true - Clear")).toBeInTheDocument()
    })

    test("If userSettings preferGradient is true", () => {
        setLocalStorageItem("userSettings", { 
            ...DEFAULTS.userSettings, 
            preferGradient: true 
        })

        render(<Background />)

        expect.soft(screen.queryByText("Gradient - true - Clear")).toBeInTheDocument()
    })

    test("Provided to Canvas as fallback", () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings)
        
        render(<Background />)

        expect.soft(screen.queryByText("Gradient - true - Clear")).toBeInTheDocument()
    })
})

describe("High Contrast", () => {
    test.each([
        ["Prefers Gradients and High Constrast", true, true],
        ["Prefers Gradients and not High Constrast", true, false],
        ["Prefers High Contrast and not Gradients", false, true],
        ["Doesn't prefer High Contrast and Gradients", false, false],
    ])("%s", (_, preferGradient, highContrastForLive) => {
        setLocalStorageItem("userSettings", { 
            ...DEFAULTS.userSettings, 
            preferGradient,
            highContrastForLive
        })

        const { container: { firstChild } } = render(
            <div id="root">
                <Background />
            </div>
        )
        
        if(highContrastForLive) {
            expect(getComputedStyle(firstChild as Element).color).toBe("rgb(63, 63, 63)")
        }
        else {
            expect(getComputedStyle(firstChild as Element).color).not.toBe("rgb(63, 63, 63)")
        }
    })

    test.each([
        ["with Gradients", "Overcast", true],
        ["without Gradients", "Overcast", false],
    ])("When rayleigh isn't 1 %s", (_, condition, preferGradient) => {
        vi.mocked(Weather.prototype.getNow).mockReturnValue({
            conditionInfo: {
                type: condition
            }
        } as any)
        
        setLocalStorageItem("userSettings", {
            ...DEFAULTS.userSettings,
            preferGradient,
            highContrastForLive: true
        })

        const { container: { firstChild } } = render(
            <div id="root">
                <Background />
            </div>
        )

        expect(getComputedStyle(firstChild as Element).color).not.toBe("rgb(63, 63, 63)")
    })
})

const sunny = [1, 0.75, 0.25]
const cloudy = [5, 0.75, 0.1]
const night = [0.01, 0.75, 0.2]

describe.each([
    ["Day", true],
    ["Night", false],
])("Sun at %s", (_, isDay) => {
    test.each([
        ["Clear", sunny, night],
        ["Drizzle", cloudy, night],
        ["Foggy", cloudy, night],
        ["Freezing Drizzle", cloudy, night],
        ["Freezing Rain", cloudy, night],
        ["Mostly Clear", sunny, night],
        ["Overcast", cloudy, night],
        ["Partly Cloudy", cloudy, night],
        ["Rain", cloudy, night],
        ["Rain Showers", cloudy, night],
        ["Snow", cloudy, night],
        ["Snow Grains", cloudy, night],
        ["Snow Showers", cloudy, night],
        ["Thunderstorms", cloudy, night],
        ["Thunderstorms and Hail", cloudy, night],
    ] as [WeatherCondition["type"], number[], number[]][])("%s", (condition, day, night) => {
        vi.mocked(Weather.prototype.isDay).mockReturnValue(isDay)
        vi.mocked(Weather.prototype.getNow).mockReturnValue({
            conditionInfo: {
                type: condition
            }
        } as any)
        setLocalStorageItem("userSettings", DEFAULTS.userSettings)

        render(<Background />)

        expect(mocks.Sky).toHaveBeenLastCalledWith(
            expect.objectContaining({
                rayleigh: isDay ? day[0] : night[0],
                inclination: isDay ? day[1] : night[1],
                mieCoefficient: 0.005,
                mieDirectionalG: 0.99,
                turbidity: 1,
                azimuth: 0.25
            }),
            expect.anything()
        )

        expect(mocks.Canvas).toHaveBeenLastCalledWith(
            expect.objectContaining({
                gl: {
                    toneMappingExposure: isDay ? day[2] : night[2]
                }
            }),
            expect.anything()
        )
    })
})