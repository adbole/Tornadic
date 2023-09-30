
import { apiWeatherGov_alerts, apiWeatherGov_points } from "__tests__/__mocks__";
import { act, renderHook } from "@testing-library/react";
import { SWRConfig } from "swr";

import { useNWS } from "Hooks";


const errorCaller = vi.fn();

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), onError: errorCaller }}>
            {children}
        </SWRConfig>
    );
}

const renderNWS = (lat?: number, long?: number) => 
    renderHook(() => useNWS(lat, long), { wrapper: Wrapper });

afterEach(() => {
    errorCaller.mockClear();
})

test("no request are made if nothing is passed", () => {
    const { result } = renderNWS();

    expect.soft(fetch).not.toHaveBeenCalled();
    expect.soft(result.current.point).toBeUndefined();
    expect.soft(result.current.alerts).toBeUndefined();
    expect.soft(result.current.isLoading).toBe(false);
});

describe("data fetching", () => {
    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    test("gets the point data first", async () => {
        renderNWS(1, 1);
    
        expect.soft(fetch).toHaveBeenCalledOnce();
    })

    test("if point data fails, then alert data is never fetched", async () => {
        fetchMock.mockReject();
        renderNWS(1, 1);

        expect.soft(fetch).toHaveBeenCalledOnce();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        
        const requests = fetchMock.requests().map(req => req.url);
        expect.soft(fetch).toHaveBeenCalledTimes(2);
        expect.soft(requests[0]).toContain("points");
        expect.soft(requests[1]).toContain("points");

        expect.soft(errorCaller).toHaveBeenCalledTimes(2);
    })

    test("gets the alert data if point data is OK", async () => {
        const { result } = renderNWS(1, 1);

        expect.soft(fetch).toHaveBeenCalledOnce()
        
        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        
        expect.soft(fetch).toHaveBeenCalledTimes(2);
        expect.soft(result.current.point).toStrictEqual(apiWeatherGov_points);
        expect.soft(result.current.alerts).toHaveLength(apiWeatherGov_alerts.features.length);
        expect.soft(result.current.isLoading).toBe(false);
    })

    test("alerts are refreshed when they expire", async () => {
        renderNWS(1, 1);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(fetch).toHaveBeenCalledTimes(2);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        })

        expect.soft(fetch).toHaveBeenCalledTimes(3);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        })

        expect.soft(fetch).toHaveBeenCalledTimes(4);
    })

    describe.todo("radar alert mode tests")
})