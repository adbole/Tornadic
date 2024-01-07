import { MapContainer, useMap } from "react-leaflet";
import useWeather from "__tests__/__mocks__/useWeather";
import { mockDate } from "__tests__/__utils__";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";

import { Home } from "Components/Radar/__internal__";

import { vars } from "ts/StyleMixins";


mockDate();

vi.mock("Contexts/WeatherContext", () => useWeather);

vi.mock("svgs/radar", async importOriginal => ({
    ...((await importOriginal()) as any),
    Grid: () => <span>Grid</span>,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            <Home />
            {children}
        </MapContainer>
    );
}

test("When not zoomed, sets the proper styles and disables some settings", () => {
    const {
        result: { current: map },
    } = renderHook(useMap, { wrapper: Wrapper });

    const mapContainer = document.querySelector(".leaflet-container")!;
    const controlContainer = document.querySelector(".leaflet-control-container")!;

    expect.soft(mapContainer).toHaveStyle({
        position: "relative",
        cursor: "pointer",
        borderRadius: vars.borderRadius,
    });
    expect.soft(controlContainer).toHaveStyle("display: none");

    expect.soft(map.dragging.enabled()).toBe(false);
    expect.soft(map.scrollWheelZoom.enabled()).toBe(false);
});

test("Causes the leaflet map to zoom when clicked and enable some settings", () => {
    const {
        result: { current: map },
    } = renderHook(useMap, { wrapper: Wrapper });

    const mapContainer = document.querySelector(".leaflet-container")!;
    const controlContainer = document.querySelector(".leaflet-control-container")!;

    act(() => {
        fireEvent.click(mapContainer);
    });

    expect.soft(mapContainer).toHaveStyle({
        zIndex: vars.zLayer1,
        inset: 0,
        position: "fixed",
    });
    expect.soft(controlContainer).not.toHaveStyle("display: none");

    expect.soft(map.dragging.enabled()).toBe(true);
    expect.soft(map.scrollWheelZoom.enabled()).toBe(true);
});

describe("Home Button", () => {
    test("Renders a button with the leaflet classes and a grid icon", () => {
        render(
            <MapContainer>
                <Home />
            </MapContainer>
        );

        const unzoomButton = screen.getByTitle("Return to Dashboard");

        expect.soft(unzoomButton).toBeInTheDocument();
        expect.soft(unzoomButton).toHaveClass("leaflet-custom-control", "leaflet-control");

        expect.soft(screen.queryByText("Grid")).toBeInTheDocument();
    });

    test("Clicking the button unzooms", () => {
        const { container } = render(
            <MapContainer>
                <Home />
            </MapContainer>
        );

        const map = container.querySelector(".leaflet-container")!;
        const controlContainer = container.querySelector(".leaflet-control-container")!;

        act(() => {
            fireEvent.click(map);
        });

        expect.soft(map).toHaveStyle({
            zIndex: vars.zLayer1,
            inset: 0,
            position: "fixed",
        });
        expect.soft(controlContainer).not.toHaveStyle("display: none");

        const unzoomButton = screen.getByTitle("Return to Dashboard");
        expect.soft(unzoomButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(unzoomButton);
        });

        expect.soft(map).toHaveStyle({
            position: "relative",
            cursor: "pointer",
            borderRadius: vars.borderRadius,
        });
        expect.soft(controlContainer).toHaveStyle("display: none");
    });
});
