import { apiWeatherGov_points, multiAlert } from "@test-mocks";
import { dispatchStorage, setLocalStorageItem } from "@test-utils";

import { act, renderHook } from "@testing-library/react";
import { SWRConfig } from "swr";

import { useNWS } from "Hooks";
import DEFAULTS from "Hooks/useLocalStorage.config";

import NWSAlert from "ts/NWSAlert";


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

test("no request are made if nothing is passed", () => {
    const { result } = renderNWS();

    expect.soft(fetchMock).not.toHaveBeenCalled();
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

    test("Gets the point and alert data at the same time", async () => {
        renderNWS(1, 1);

        expect.soft(fetchMock).toHaveBeenCalledWith("https://api.weather.gov/points/1,1");
        expect
            .soft(fetchMock)
            .toHaveBeenCalledWith("https://api.weather.gov/alerts/active?point=1,1");

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("alerts are refreshed when they expire", async () => {
        renderNWS(1, 1);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(3);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(4);
    });
});

describe("Radar Alert Mode", () => {
    beforeAll(() => {
        vi.useFakeTimers();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    test("If radar alert mode is enabled, then all active alerts are fetched", async () => {
        setLocalStorageItem("radarSettings", {
            ...DEFAULTS.radarSettings,
            alertMode: true,
        });

        renderNWS(1, 1);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);
        expect.soft(fetchMock).toHaveBeenLastCalledWith("https://api.weather.gov/alerts/active");
    });

    test("If radar alert mode is enabled after first fetch, then a refetch of all alerts is called", async () => {
        setLocalStorageItem("radarSettings", {
            ...DEFAULTS.radarSettings,
            alertMode: false,
        });

        renderNWS(1, 1);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);
        expect
            .soft(fetchMock)
            .not.toHaveBeenLastCalledWith("https://api.weather.gov/alerts/active");

        act(() => {
            setLocalStorageItem("radarSettings", {
                ...DEFAULTS.radarSettings,
                alertMode: true,
            });
            dispatchStorage("radarSettings");
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(3);
        expect.soft(fetchMock).toHaveBeenLastCalledWith("https://api.weather.gov/alerts/active");
    });
});

describe("Expired Alerts", () => {
    test.each([
        ["", "references", true, false],
        ["", "expiredReferences", true, true],
        ["don't ", "references", false, false],
        ["don't ", "expiredReferences", false, true],
    ])(
        "Alerts that %s have messageType Update have their %s filtered out",
        async (x, y, update, expired) => {
            vi.useFakeTimers();

            const multiAlertCopy = structuredClone(multiAlert);
            const alerts = multiAlertCopy.features.map(
                alert => new NWSAlert(alert as unknown as NWSAlert)
            );

            //2nd to last alert is used for expiration testing
            const updateAlert = multiAlertCopy.features[multiAlertCopy.features.length - 2];

            if (!update) {
                updateAlert.properties.messageType = "Actual";
            }

            if (expired) {
                updateAlert.properties.parameters.expiredReferences = [
                    updateAlert.properties.references[0].identifier,
                ];
                updateAlert.properties.references = [];
            }

            const { result } = renderNWS(1, 1);

            fetchMock.mockOnce(JSON.stringify(multiAlertCopy));

            await act(async () => {
                await vi.runOnlyPendingTimersAsync();
            });

            expect.soft(fetchMock).toHaveBeenCalledTimes(2);
            expect.soft(result.current.point).toStrictEqual(apiWeatherGov_points);
            expect.soft(result.current.alerts!.length).not.toBe(alerts.length);
            expect.soft(result.current.isLoading).toBe(false);

            vi.useRealTimers();
        }
    );
});
