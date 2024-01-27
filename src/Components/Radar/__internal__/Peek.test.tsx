import { MapContainer, useMap } from "react-leaflet";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import L from "leaflet";

import { Peek } from ".";


const mocks = vi.hoisted(() => ({
    popup: vi.fn(),
    peek: vi.fn(({ isOpen }: { isOpen: boolean }) => <>{isOpen && <div role="dialog" />}</>),
    latLng: { lat: 35, lng: -95 } as L.LatLng,
}));

vi.mock("Components/Modals/Peek", () => ({ default: mocks.peek }));

vi.mock("react-leaflet", async importOriginal => ({
    ...((await importOriginal()) as any),
    Popup: mocks.popup,
}));

vi.spyOn(L.Map.prototype, "containerPointToLatLng").mockReturnValue(mocks.latLng);

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            {children}
            <Peek />
        </MapContainer>
    );
}

test("Does nothing when user isn't interacting with the map", () => {
    const { container } = render(
        <MapContainer>
            <Peek />
        </MapContainer>
    );

    const element = container.querySelector(".leaflet-popup-pane");

    expect.soft(element).toBeEmptyDOMElement();
    expect.soft(mocks.popup).not.toHaveBeenCalled();
    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

describe.each([
    ["mousedown", "mousemove", "mouseup", { latlng: { lat: 35, lng: -95 } as L.LatLng }],
    ["touchstart", "touchmove", "touchend", { touches: [{ clientX: 100, clientY: 100 }] }],
] as ["mousedown" | "touchstart", string, string, any][])(
    "%s, %s, %s",
    (event, moveCancel, upCancel, args) => {
        const fire = (map: L.Map) => {
            if (event === "mousedown") map.fire(event, args);
            else fireEvent.touchStart(map.getContainer(), args);
        };

        test("After 100ms the popup appears", () => {
            const {
                result: { current: map },
            } = renderHook(useMap, { wrapper: Wrapper });

            
            act(() => {
                fire(map);
            });

            expect.soft(mocks.popup).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(100);
            })

            expect.soft(mocks.popup).toHaveBeenCalledOnce()
        })

        test("After a second the modal appears", () => {
            const {
                result: { current: map },
            } = renderHook(useMap, { wrapper: Wrapper });

            expect.soft(getComputedStyle(document.body).userSelect).toBe("")

            act(() => {
                fire(map);
                vi.advanceTimersByTime(500);
            });

            expect
                .soft(mocks.popup)
                .toHaveBeenCalledWith(expect.objectContaining({ position: mocks.latLng }), {});
            expect
                .soft(mocks.peek)
                .not.toHaveBeenCalledWith(
                    expect.objectContaining({ latitude: 35, longitude: -95 }),
                    {}
                );
            expect.soft(getComputedStyle(document.body).userSelect).toBe("none")

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
            expect
                .soft(mocks.peek)
                .toHaveBeenCalledWith(
                    expect.objectContaining({ latitude: 35, longitude: -95 }),
                    {}
                );
            expect.soft(getComputedStyle(document.body).userSelect).toBe("")
        });

        test.each([
            ["When the user moves (or drags) the popup disappears", moveCancel],
            ["When the user releases the popup disappears", upCancel],
        ])("%s", (_, cancelMethod) => {
            const {
                result: { current: map },
            } = renderHook(useMap, { wrapper: Wrapper });

            act(() => {
                fire(map);

                vi.advanceTimersByTime(500);
            });

            expect
                .soft(mocks.popup)
                .toHaveBeenCalledWith(expect.objectContaining({ position: mocks.latLng }), {});

            act(() => {
                if (event === "mousedown") map.fire(cancelMethod);
                else fireEvent(map.getContainer(), new TouchEvent(cancelMethod));

                vi.advanceTimersByTime(500);
            });

            expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    }
);
