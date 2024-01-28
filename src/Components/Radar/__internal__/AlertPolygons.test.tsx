import { multiAlert, useWeather } from "@test-mocks";
import { mockDate } from "@test-utils";

import type { GeoJSONProps } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import { act, render } from "@testing-library/react";
import type { ModalProps } from "Components";
import type { LeafletMouseEvent } from "leaflet";

import NWSAlert from "ts/NWSAlert";

import { AlertPolygons } from ".";


mockDate();

const mock_alerts = multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert));

const mocks = vi.hoisted(() => ({
    AlertModal: vi.fn(({ onClose }: ModalProps) => <button onClick={onClose}>Close Modal</button>),
    GeoJSON: vi.fn(() => <></>),
}));

vi.mock("Contexts/WeatherContext", () => ({
    ...useWeather,
    useWeather: () => ({
        ...useWeather(),
        alerts: multiAlert.features.map(alert => new NWSAlert(alert as unknown as NWSAlert)),
    }),
}));

vi.mock("react-leaflet", async importOriginal => ({
    ...((await importOriginal()) as any),
    GeoJSON: mocks.GeoJSON,
}));

vi.mock("Components/Modals/Alert", () => ({ default: mocks.AlertModal }));

test("Displays alerts with coords as polygons", () => {
    const noCoords = mock_alerts.filter(alert => !alert.hasCoords());

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

describe("Polygon Interaction", () => {
    test("If a single polygon is clicked, then the modal for that alert should open", () => {
        render(
            <MapContainer>
                <AlertPolygons />
            </MapContainer>
        );

        expect.soft(mocks.GeoJSON).toHaveBeenCalledTimes(3);

        const [{ eventHandlers }] = mocks.GeoJSON.mock.lastCall as unknown as [GeoJSONProps, any];

        expect.soft(eventHandlers?.click).toBeInstanceOf(Function);

        act(() => {
            eventHandlers?.click?.({
                latlng: { lat: 1, lng: 1 },
            } as LeafletMouseEvent);
        });

        const expectedAlert = mock_alerts.filter(alert => alert.hasCoords())[0];
        expect.soft(mocks.AlertModal).toHaveBeenLastCalledWith(
            expect.objectContaining({
                alerts: [expectedAlert],
                isOpen: true,
            }),
            {}
        );
    });

    test("If the point the user clicked intersects multiple polygons, then the modal for all of those alerts should open", () => {
        render(
            <MapContainer>
                <AlertPolygons />
            </MapContainer>
        );

        expect.soft(mocks.GeoJSON).toHaveBeenCalledTimes(3);

        const [{ eventHandlers }] = mocks.GeoJSON.mock.lastCall as unknown as [GeoJSONProps, any];

        expect.soft(eventHandlers?.click).toBeInstanceOf(Function);

        act(() => {
            eventHandlers?.click?.({
                latlng: { lat: 5, lng: 5 },
            } as LeafletMouseEvent);
        });

        const expectedAlerts = mock_alerts.filter(alert => alert.hasCoords()).slice(0, 2);
        expect.soft(mocks.AlertModal).toHaveBeenLastCalledWith(
            expect.objectContaining({
                alerts: expectedAlerts,
                isOpen: true,
            }),
            {}
        );
    });
});

test.todo(
    "Tooltips require manual testing due to lack of svg support in jsdom preventing polygon render"
);
