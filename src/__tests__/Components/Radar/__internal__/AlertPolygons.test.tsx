import type { GeoJSONProps } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import { multiAlert } from "__tests__/__mocks__";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ModalProps } from "Components";

import { AlertPolygons } from "Components/Radar/__internal__";

import NWSAlert from "ts/NWSAlert";


mockDate();

const mocks = vi.hoisted(() => ({
    AlertModal: vi.fn(({ onClose }: ModalProps) => <button onClick={onClose}>Close Modal</button>),
    GeoJSON: vi.fn(() => <></>),
}));

vi.mock("Contexts/WeatherContext", () => ({
    ...useWeather,
    useWeather: () => ({
        ...useWeather.useWeather(),
        alerts: multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert)),
    }),
}));

vi.mock("react-leaflet", async importOriginal => ({
    ...((await importOriginal()) as any),
    GeoJSON: mocks.GeoJSON,
}));

vi.mock("Components/Modals/Alert", () => ({ default: mocks.AlertModal }));

afterEach(() => {
    vi.clearAllMocks();
});

test("Displays alerts with coords as polygons", () => {
    const alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));
    const noCoords = alerts.filter(alert => !alert.hasCoords());

    render(
        <MapContainer>
            <AlertPolygons />
        </MapContainer>
    );

    expect.soft(mocks.GeoJSON).toHaveBeenCalledTimes(3);
    expect.soft(mocks.GeoJSON.mock.calls.length).not.toBe(multiAlert.features.length);

    for (const alert of noCoords) {
        expect
            .soft(mocks.GeoJSON)
            .not.toHaveBeenCalledWith(expect.objectContaining({ data: alert }), {});
    }
});

test("A onClick handler is passed to each GeoJSON that opens its respective alert in a modal", () => {
    render(
        <MapContainer>
            <AlertPolygons />
        </MapContainer>
    );

    expect.soft(mocks.GeoJSON).toHaveBeenCalledTimes(3);

    //Copy the array
    const calls = mocks.GeoJSON.mock.calls.slice() as unknown as [GeoJSONProps, any][];

    for (const call of calls) {
        const [{ data, eventHandlers }] = call as unknown as [GeoJSONProps, any];

        expect.soft(eventHandlers?.click).toBeInstanceOf(Function);

        act(() => {
            eventHandlers?.click?.({} as any);
        });

        expect.soft(mocks.AlertModal).toHaveBeenLastCalledWith(
            expect.objectContaining({
                alerts: [data],
                isOpen: true,
            }),
            {}
        );

        act(() => {
            fireEvent.click(screen.getByText("Close Modal"));
        });
    }
});

test("If the map has dragging disabled, then it isn't zoomed, so alert modals shouldn't open", () => {
    render(
        <MapContainer dragging={false}>
            <AlertPolygons />
        </MapContainer>
    );

    expect.soft(mocks.GeoJSON).toHaveBeenCalledTimes(3);

    const [{ eventHandlers }] = mocks.GeoJSON.mock.lastCall as unknown as [GeoJSONProps, any];

    expect.soft(eventHandlers?.click).toBeInstanceOf(Function);

    act(() => {
        eventHandlers?.click?.({} as any);
    });

    expect
        .soft(mocks.AlertModal)
        .not.toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }), {});
});
