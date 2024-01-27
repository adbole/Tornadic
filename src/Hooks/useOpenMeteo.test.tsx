import { mockDate, setLocalStorageItem } from "@test-utils";

import { act, renderHook } from "@testing-library/react";
import { SWRConfig } from "swr";

import { useOpenMeteo } from "Hooks";
import DEFAULTS from "Hooks/useLocalStorage.config";


const errorCaller = vi.fn();

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), onError: errorCaller }}>
            {children}
        </SWRConfig>
    );
}

const renderOpenMeteo = (lat?: number, long?: number) =>
    renderHook(() => useOpenMeteo(lat, long), { wrapper: Wrapper });

mockDate();

afterEach(() => {
    errorCaller.mockReset();
});

describe("no requests", () => {
    test("when no params are passed", () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);
        const { result } = renderOpenMeteo();

        expect.soft(fetchMock).not.toHaveBeenCalled();
        expect.soft(result.current.weather).toBeUndefined();
        expect.soft(result.current.isLoading).toBe(false);
    });

    test("when settings aren't set", () => {
        const { result } = renderOpenMeteo(1, 1);

        expect.soft(fetchMock).not.toHaveBeenCalled();
        expect.soft(result.current.weather).toBeUndefined();
        expect.soft(result.current.isLoading).toBe(false);
    });
});

describe("data fetching", () => {
    test("passes lat and long as expected to each request", async () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);
        renderOpenMeteo(1, 1);

        const requests = fetchMock.requests().map(req => req.url);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect.soft(requests[0]).toContain("latitude=1&longitude=1");
        expect.soft(requests[1]).toContain("latitude=1&longitude=1");

        //Weather will throw an error relating to not being able to find current time for forecast
        //This is irrelavent to this test and the following ensures it initializes properly to supress it.
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
    });

    test("gets the data when all params are passed and settings set", async () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);
        const { result } = renderOpenMeteo(1, 1);

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);
        expect.soft(result.current.isLoading).toBe(true);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(result.current.isLoading).toBe(false);
        expect.soft(result.current.weather).toBeDefined();
    });

    test("throws an error if any request fails", async () => {
        fetchMock.mockReject();

        setLocalStorageItem("userSettings", DEFAULTS.userSettings);
        const { result } = renderOpenMeteo(1, 1);

        expect.soft(result.current.isLoading).toBe(true);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(errorCaller).toHaveBeenCalled();
        expect.soft(result.current.isLoading).toBe(false);
        expect.soft(result.current.weather).toBeUndefined();
    });

    test("data is refreshed at the next hour", async () => {
        setLocalStorageItem("userSettings", DEFAULTS.userSettings);
        renderOpenMeteo(1, 1);

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(3.6e6 - (new Date().getTime() % 3.6e6));
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(4);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(3.6e6 - (new Date().getTime() % 3.6e6));
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(6);
    });
});
