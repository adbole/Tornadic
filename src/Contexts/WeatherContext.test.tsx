import testIds from "@test-consts/testIDs";
import { mockDate, setLocalStorageItem } from "@test-utils";

import { act, render, renderHook, screen } from "@testing-library/react";
import { SWRConfig } from "swr";

import DEFAULTS from "Hooks/useLocalStorage.config";

import WeatherProvider, { useWeather } from "./WeatherContext";


const skeleton = "SKELETON";
const child = "CHILD";

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <WeatherProvider
                latitude={1}
                longitude={1}
                skeleton={<div data-testid={skeleton} />}
            >
                {children}
            </WeatherProvider>
        </SWRConfig>
    );
}

const renderWeather = () => renderHook(useWeather, { wrapper: Wrapper });
const renderNormal = () => render(<Wrapper><div data-testid={child} /></Wrapper>);

mockDate();

beforeEach(() => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);
});

describe("Render", () => {
    test("Renders skeleton when loading without any data", async () => {
        renderNormal();
        expect(screen.queryByTestId(skeleton)).toBeInTheDocument();

        //Weather will throw an error relating to not being able to find current time for forecast
        //This is irrelavent to this test and the following ensures it initializes properly to supress it.
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
    });

    test("Child appears when data is loaded", async () => {
        renderNormal();
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByTestId(child)).toBeInTheDocument();
    });

    test("Keeps skeleton up if any fetch throws", async () => {
        fetchMock.mockReject();

        renderNormal();

        await act(async () => {
            await vi.advanceTimersToNextTimerAsync();
        });

        expect(screen.getByTestId(skeleton)).toBeInTheDocument();
    });

    test("Keeps children up if any fetch throws during data update", async () => {
        renderNormal();
        
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        fetchMock.mockReject();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByTestId(child)).toBeInTheDocument();
    });

    test("Displays a loading bar when new data is being fetched and old data is still present", async () => {
        renderNormal();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        fetchMock.mockResponse(() => new Promise((resolve) => setTimeout(resolve, 1000, { body: "{}" })));

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByTestId(testIds.WeatherContext.LoadingBar)).toBeInTheDocument();
    });
});

describe("Hook", () => {
    test("Throws error when used outside of provider", () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);

        expect(() => renderHook(useWeather)).toThrowError();

        vi.mocked(console.error).mockRestore();
    });

    test("Returns the data when used inside provider", async () => {
        const { result } = renderWeather();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(result.current.weather).toBeTruthy();
    });
});
