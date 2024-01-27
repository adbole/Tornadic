import { rainviewer } from "@test-mocks";
import { dispatchStorage, setLocalStorageItem } from "@test-utils";

import { MapContainer, useMap } from "react-leaflet";
import { act, renderHook, screen } from "@testing-library/react";
import L from "leaflet";
import { SWRConfig } from "swr";

import { useRainViewer } from "Hooks";
import { RADAR_PANE } from "Hooks/useRainViewer";


const errorCaller = vi.fn();
const rainviewerObj = rainviewer();

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map(), onError: errorCaller }}>
            <MapContainer>{children}</MapContainer>
        </SWRConfig>
    );
}

const renderRainViewer = () => renderHook(useRainViewer, { wrapper: Wrapper });

const constructRadarPath = (path: string, color = 6, smoothing = 1, snow = 0) =>
    `${rainviewerObj.host}${path}/512/{z}/{x}/{y}/${color}/${smoothing}_${snow}.png`;
const constructSatellitePath = (path: string) =>
    `${rainviewerObj.host}${path}/512/{z}/{x}/{y}/0/1_0.png`;

beforeEach(() => {
    vi.useFakeTimers();

    const past = rainviewerObj.radar.past;
    vi.setSystemTime(past[past.length - 1].time * 1000);
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

describe("Data Fetching", () => {
    test("Requests data from rainviewer", () => {
        const { result } = renderRainViewer();

        expect.soft(fetchMock).toHaveBeenCalledTimes(1);
        expect
            .soft(fetchMock)
            .toHaveBeenCalledWith("https://api.rainviewer.com/public/weather-maps.json");

        expect.soft(result.current.availableLayers).toBeNull();
        expect.soft(result.current.active).toBe("Radar");
        expect.soft(result.current.showFrame).toBeTruthy();
        expect.soft(result.current.isLoading).toBe(true);
    });

    test("Fetches new data from rainviewer once the time is equal to nowcast", async () => {
        renderRainViewer();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
            await vi.advanceTimersByTimeAsync(1000);
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(1);
        expect
            .soft(fetchMock)
            .toHaveBeenCalledWith("https://api.rainviewer.com/public/weather-maps.json");

        await act(async () => {
            await vi.advanceTimersByTimeAsync(
                rainviewerObj.radar.nowcast.slice(-1)[0].time * 1000 - Date.now()
            );
        });

        expect.soft(fetchMock).toHaveBeenCalledTimes(2);
    });

    test("When data can't be fetched an error is thrown", async () => {
        fetchMock.mockRejectOnce();

        renderRainViewer();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect.soft(errorCaller).toHaveBeenCalledTimes(1);
    });
});

test("Once fetched, the map is prepared and availableLayers is provided", async () => {
    vi.spyOn(L.Map.prototype, "createPane");
    vi.spyOn(L, "tileLayer");

    const { result } = renderRainViewer();

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    });

    expect.soft(result.current.isLoading).toBe(false);
    expect.soft(result.current.availableLayers).not.toBeNull();

    expect
        .soft(result.current.availableLayers?.Radar.currentLayerIndex)
        .toBe(rainviewerObj.radar.past.length - 1);
    expect
        .soft(result.current.availableLayers?.Satellite.currentLayerIndex)
        .toBe(rainviewerObj.satellite.infrared.length - 1);

    //Layer control
    expect.soft(screen.queryByRole("radio", { name: "Radar" })).toBeInTheDocument();
    expect.soft(screen.queryByRole("radio", { name: "Satellite" })).toBeInTheDocument();

    //There are 7 panes in leaflet ours makes 8
    expect.soft(L.Map.prototype.createPane).toHaveBeenCalledTimes(8);
    expect.soft(L.Map.prototype.createPane).toHaveBeenLastCalledWith(RADAR_PANE);
    expect.soft(L.tileLayer).not.toHaveBeenCalled();
});

describe("showFrame", () => {
    test("When showFrame is called, the layer at the index is loaded and preloads right", async () => {
        vi.spyOn(L, "tileLayer");

        const { result } = renderRainViewer();

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        result.current.showFrame(rainviewerObj.radar.past.length - 1);

        expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
        expect.soft(L.tileLayer).toHaveBeenCalledWith(
            constructRadarPath(rainviewerObj.radar.past[rainviewerObj.radar.past.length - 1].path),
            expect.objectContaining({
                pane: RADAR_PANE,
                opacity: 0.0,
            })
        );
        expect.soft(L.tileLayer).toHaveBeenLastCalledWith(
            constructRadarPath(rainviewerObj.radar.nowcast[0].path),
            expect.objectContaining({
                pane: RADAR_PANE,
                opacity: 0.0,
            })
        );
    });

    test("When the layer is satellite, frames are loaded from satellite", async () => {
        vi.spyOn(L, "tileLayer");

        const { result } = renderHook(
            () => ({
                useRainViewer: useRainViewer(),
                map: useMap(),
            }),
            { wrapper: Wrapper }
        );

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        act(() => {
            result.current.map.fire("baselayerchange", { name: "Satellite" });
        });

        const infrared = rainviewerObj.satellite.infrared;
        result.current.useRainViewer.showFrame(infrared.length - 1);

        expect.soft(result.current.useRainViewer.active).toBe("Satellite");

        expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
        expect.soft(L.tileLayer).toHaveBeenCalledWith(
            constructSatellitePath(infrared[infrared.length - 1].path),
            expect.objectContaining({
                pane: RADAR_PANE,
                opacity: 0.0,
            })
        );
        expect.soft(L.tileLayer).toHaveBeenLastCalledWith(
            constructSatellitePath(infrared[0].path),
            expect.objectContaining({
                pane: RADAR_PANE,
                opacity: 0.0,
            })
        );
    });

    describe("Wrapping", () => {
        test("If showFrame is given a value outside of the range, it is wrapped", async () => {
            vi.spyOn(L, "tileLayer");

            const { result } = renderRainViewer();

            await act(async () => {
                await vi.runOnlyPendingTimersAsync();
            });

            result.current.showFrame(result.current.availableLayers!.Radar.frames.length);

            expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
            expect
                .soft(L.tileLayer)
                .toHaveBeenCalledWith(
                    constructRadarPath(rainviewerObj.radar.past[0].path),
                    expect.anything()
                );
            expect
                .soft(L.tileLayer)
                .toHaveBeenLastCalledWith(
                    constructRadarPath(rainviewerObj.radar.past[1].path),
                    expect.anything()
                );
        });

        test("Wraps preload to beginning if next frame is out of range", async () => {
            vi.spyOn(L, "tileLayer");

            const { result } = renderRainViewer();

            await act(async () => {
                await vi.runOnlyPendingTimersAsync();
            });

            result.current.showFrame(result.current.availableLayers!.Radar.frames.length - 1);

            expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
            expect
                .soft(L.tileLayer)
                .toHaveBeenCalledWith(
                    constructRadarPath(
                        rainviewerObj.radar.nowcast[rainviewerObj.radar.nowcast.length - 1].path
                    ),
                    expect.anything()
                );
            expect
                .soft(L.tileLayer)
                .toHaveBeenLastCalledWith(
                    constructRadarPath(rainviewerObj.radar.past[0].path),
                    expect.anything()
                );
        });

        test("Wraps negative values if given and preloads left", async () => {
            vi.spyOn(L, "tileLayer");

            const { result } = renderRainViewer();

            await act(async () => {
                await vi.runOnlyPendingTimersAsync();
            });

            result.current.showFrame(-1);

            const nowcast = rainviewerObj.radar.nowcast;

            expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
            expect
                .soft(L.tileLayer)
                .toHaveBeenCalledWith(
                    constructRadarPath(nowcast[nowcast.length - 1].path),
                    expect.anything()
                );
            expect
                .soft(L.tileLayer)
                .toHaveBeenLastCalledWith(
                    constructRadarPath(nowcast[nowcast.length - 2].path),
                    expect.anything()
                );
        });
    });
});

test("When settings change, availableLayers is updated and showFrame renders layers with new settings", async () => {
    vi.spyOn(L.Map.prototype, "createPane");
    vi.spyOn(L, "tileLayer");

    const { result } = renderRainViewer();

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    });

    const oldLayers = result.current.availableLayers;
    result.current.showFrame(rainviewerObj.radar.past.length - 1);

    expect.soft(L.tileLayer).toHaveBeenCalledTimes(2);
    expect.soft(L.tileLayer).toHaveBeenCalledWith(
        constructRadarPath(rainviewerObj.radar.past[rainviewerObj.radar.past.length - 1].path),
        expect.objectContaining({
            pane: RADAR_PANE,
            opacity: 0.0,
        })
    );
    expect.soft(L.tileLayer).toHaveBeenLastCalledWith(
        constructRadarPath(rainviewerObj.radar.nowcast[0].path),
        expect.objectContaining({
            pane: RADAR_PANE,
            opacity: 0.0,
        })
    );

    act(() => {
        setLocalStorageItem("radarSettings", {
            colorScheme: 1,
            smoothing: true,
            snow: true,
        })
        dispatchStorage("radarSettings")
    })

    const newLayers = result.current.availableLayers;
    result.current.showFrame(rainviewerObj.radar.past.length - 1);

    expect.soft(oldLayers).not.toBe(newLayers);

    expect.soft(L.tileLayer).toHaveBeenCalledTimes(4);
    expect.soft(L.tileLayer).toHaveBeenCalledWith(
        constructRadarPath(rainviewerObj.radar.past[rainviewerObj.radar.past.length - 1].path, 1, 1, 1),
        expect.objectContaining({
            pane: RADAR_PANE,
            opacity: 0.0,
        })
    );
    expect.soft(L.tileLayer).toHaveBeenLastCalledWith(
        constructRadarPath(rainviewerObj.radar.nowcast[0].path, 1, 1, 1),
        expect.objectContaining({
            pane: RADAR_PANE,
            opacity: 0.0,
        })
    );
})