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

const leafletMouseEvent = { 
    latlng: mocks.latLng,
    originalEvent: { 
        clientX: 0, 
        clientY: 0 
    }
} as L.LeafletMouseEvent

describe.each([
    ["mousedown", "mousemove", "mouseup", leafletMouseEvent],
    ["touchstart", "touchmove", "touchend", { touches: [leafletMouseEvent.originalEvent] }],
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
            });

            expect.soft(mocks.popup).toHaveBeenCalledOnce();
        });

        test("After a second the modal appears", () => {
            const {
                result: { current: map },
            } = renderHook(useMap, { wrapper: Wrapper });

            expect.soft(getComputedStyle(document.body).userSelect).toBe("");

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
            expect.soft(getComputedStyle(document.body).userSelect).toBe("none");

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
            expect.soft(getComputedStyle(document.body).userSelect).toBe("");
        });

        test("When the user releases the popup disappears", () => {
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
                if (event === "mousedown") map.fire(upCancel);
                else fireEvent(map.getContainer(), new TouchEvent(upCancel));

                vi.advanceTimersByTime(500);
            });

            expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        test.each([
            ["When the user moves within the threshold the interaction continues", { clientX: 10, clientY: 10 }],
            ["+X movement beyond threshold causes the interaction to cancel", { clientX: 21, clientY: 10 }],
            ["-X movement beyond threshold causes the interaction to cancel", { clientX: -21, clientY: 10 }],
            ["+Y movement beyond threshold causes the interaction to cancel", { clientX: 10, clientY: 21 }],
            ["-Y movement beyond threshold causes the interaction to cancel", { clientX: 10, clientY: -21 }],
        ])("%s", (_, client) => {
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
                if (event === "mousedown") map.fire(moveCancel, { originalEvent: client } as L.LeafletMouseEvent);
                else fireEvent(map.getContainer(), new TouchEvent(moveCancel, { touches: [client as any] }));

                vi.advanceTimersByTime(500);
            });

            if (client.clientX === 10 && client.clientY === 10) {
                expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
            } else {
                expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
            }
        })
    }
);
