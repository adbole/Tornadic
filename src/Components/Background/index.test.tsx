import { useWeather } from "@test-mocks";
import { mockDate, setLocalStorageItem } from "@test-utils";

import { render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Weather from "ts/Weather";
import type WeatherCondition from "ts/WeatherCondition";

import Background from ".";


mockDate();

vi.mock("Contexts/WeatherContext", () => ({ useWeather }));

type DayCondition = {
    isDay: boolean;
    condition: string;
};

type Condition = {
    condition: string;
};

const mocks = vi.hoisted(() => ({
    Sky: vi.fn(() => <div>Sky</div>),
    PerspectiveCamera: vi.fn(({ rotation }: { rotation: number[] }) => (
        <div>PerspectiveCamera</div>
    )),
    Canvas: vi.fn(
        ({
            children,
            className,
            style,
        }: {
            children: React.ReactNode;
            className: string;
            style: React.CSSProperties;
        }) => (
            <div className={className} style={style}>
                Canvas - {children}
            </div>
        )
    ),
}));

vi.mock("@react-three/drei", () => ({
    Sky: mocks.Sky,
    PerspectiveCamera: mocks.PerspectiveCamera,
    ScreenSpace: ({ children }: { children: React.ReactNode }) => (
        <div>ScreenSpace - {children}</div>
    ),
}));

vi.mock("@react-three/fiber", () => ({
    Canvas: mocks.Canvas,
}));

vi.mock("Components/Background/__internal__", () => ({
    Clouds: ({ isDay, condition }: DayCondition) => (
        <div>
            Clouds - {isDay.toString()} - {condition}
        </div>
    ),
    Gradient: ({ isDay, condition }: DayCondition) => (
        <div>
            Gradient - {isDay.toString()} - {condition}
        </div>
    ),
    Stars: ({ isDay, condition }: DayCondition) => (
        <div>
            Stars - {isDay.toString()} - {condition}
        </div>
    ),
    RainSnow: ({ condition }: Condition) => <div>RainSnow - {condition}</div>,
    Thunder: ({ condition }: Condition) => <div>Thunder - {condition}</div>,
}));

beforeEach(() => {
    vi.spyOn(Weather.prototype, "isDay").mockReturnValue(true);
    vi.spyOn(Weather.prototype, "getWeatherCondition").mockReturnValue({
        type: "Clear",
    } as WeatherCondition);
});

afterEach(() => {
    vi.mocked(Weather.prototype.isDay).mockRestore();
    vi.mocked(Weather.prototype.getWeatherCondition).mockRestore();
});

const renderBackground = () => render(<Background parentElement={document.body} />);

test("Renders the correct components", () => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);

    renderBackground();

    const canvas = screen.queryByText(/Canvas/);

    expect(canvas).toBeInTheDocument();
    expect.soft(canvas).toMatchSnapshot();
});

describe("Gradient Fallback", () => {
    test("If there are no userSettings", () => {
        renderBackground();

        expect.soft(screen.queryByText("Gradient - true - Clear")).toBeInTheDocument();
        expect.soft(screen.queryByText(/Canvas/)).not.toBeInTheDocument();
    });

    test("If userSettings preferGradient is true", () => {
        setLocalStorageItem("userSettings", {
            ...DEFAULTS.userSettings,
            preferGradient: true,
        });

        renderBackground();

        expect.soft(screen.queryByText("Gradient - true - Clear")).toBeInTheDocument();
        expect.soft(screen.queryByText(/Canvas/)).not.toBeInTheDocument();
    });
});

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
            highContrastForLive,
        });

        renderBackground();

        if (highContrastForLive) {
            expect(document.body.style.color).toBe("rgb(63, 63, 63)");
        } else {
            expect(document.body.style.color).not.toBe("rgb(63, 63, 63)");
        }
    });

    test.each([
        ["with Gradients", "Overcast", true],
        ["without Gradients", "Overcast", false],
    ])("When rayleigh isn't 1 %s", (_, condition, preferGradient) => {
        vi.mocked(Weather.prototype.getWeatherCondition).mockReturnValue({
            type: condition,
        } as WeatherCondition);

        setLocalStorageItem("userSettings", {
            ...DEFAULTS.userSettings,
            preferGradient,
            highContrastForLive: true,
        });

        renderBackground();

        expect(document.body.style.color).not.toBe("rgb(63, 63, 63)");
    });
});

// [rayleigh, rotation, exposure]
const sunny = [1, 0.35, 0.25];
const cloudy = [5, 0, 0.1];
const night = [0.01, 0.35, 0.2];

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
        vi.mocked(Weather.prototype.isDay).mockReturnValue(isDay);
        vi.mocked(Weather.prototype.getWeatherCondition).mockReturnValue({
            type: condition,
        } as WeatherCondition);
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);

        renderBackground();

        expect(mocks.Sky).toHaveBeenLastCalledWith(
            expect.objectContaining({
                rayleigh: isDay ? day[0] : night[0],
                inclination: 1,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.99,
                turbidity: 1,
                azimuth: 0.25,
            }),
            expect.anything()
        );

        expect(mocks.PerspectiveCamera).toHaveBeenLastCalledWith(
            expect.objectContaining({
                rotation: [isDay ? day[1] : night[1], 0, 0],
            }),
            expect.anything()
        );

        expect(mocks.Canvas).toHaveBeenLastCalledWith(
            expect.objectContaining({
                gl: {
                    toneMappingExposure: isDay ? day[2] : night[2],
                },
            }),
            expect.anything()
        );
    });
});
