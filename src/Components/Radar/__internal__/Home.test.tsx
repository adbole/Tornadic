import { MapContainer, useMap } from "react-leaflet";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";

import { vars } from "ts/StyleMixins";

import { Home } from ".";


const UNZOOMED_MAP_STYLE = {
    position: "relative",
    cursor: "pointer",
    borderRadius: vars.borderRadius,
}

const ZOOMED_MAP_STYLE = {
    zIndex: vars.zLayer1,
    inset: 0,
    position: "fixed",
}

const UNZOOMED_CONTAINER_STYLE = "display: none"

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

    expect.soft(mapContainer).toHaveStyle(UNZOOMED_MAP_STYLE);
    expect.soft(controlContainer).toHaveStyle(UNZOOMED_CONTAINER_STYLE);

    expect.soft(map.dragging.enabled()).toBe(false);
    expect.soft(map.scrollWheelZoom.enabled()).toBe(false);
});

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

describe("Zooming", () => {
    test("Zooms when clicked and enables some settings on map", async () => {
        const user = userEvent.setup();
        const {
            result: { current: map },
        } = renderHook(useMap, { wrapper: Wrapper });
    
        const mapContainer = document.querySelector(".leaflet-container")!;
        const controlContainer = document.querySelector(".leaflet-control-container")!;
    
        await user.click(mapContainer);
    
        expect.soft(mapContainer).toHaveStyle(ZOOMED_MAP_STYLE);
        expect.soft(controlContainer).not.toHaveStyle(UNZOOMED_CONTAINER_STYLE);
    
        expect.soft(map.dragging.enabled()).toBe(true);
        expect.soft(map.scrollWheelZoom.enabled()).toBe(true);
    });
    
    test.each([
        ["Clicking the home button unzooms", async (user) => {
            const unzoomButton = screen.getByTitle("Return to Dashboard");
            expect.soft(unzoomButton).toBeInTheDocument();
    
            await user.click(unzoomButton);
        }],
        ["Pressing escape unzooms", async (user) => {
            await user.keyboard("{Escape}");
        }], 
    ] as [string, (user: UserEvent) => Promise<void>][])("%s", async (_, handleUnzoom) => {
        const user = userEvent.setup()
        const { container } = render(
            <MapContainer>
                <Home />
            </MapContainer>
        );
    
        const map = container.querySelector(".leaflet-container")!;
        const controlContainer = container.querySelector(".leaflet-control-container")!;
    
        //First test of describe ensures styles show up as expected when click occurs
        //If that test is failing, this test's output should be considered false
        await user.click(map);
        await handleUnzoom(user);
    
        expect.soft(map).toHaveStyle(UNZOOMED_MAP_STYLE);
        expect.soft(controlContainer).toHaveStyle(UNZOOMED_CONTAINER_STYLE);
    });
    
    test("If a dialog is open, escape won't unzoom", async () => {
        const user = userEvent.setup()
        const { container } = render(
            <>
                <MapContainer>
                    <Home />
                </MapContainer>
                <dialog ref={element => element?.showModal()} />
            </>
        );
    
        const map = container.querySelector(".leaflet-container")!;
        const controlContainer = container.querySelector(".leaflet-control-container")!;
    
        //First test of describe ensures styles show up as expected when click occurs
        //If that test is failing, this test should fail or be considered as a fail
        await user.click(map);
        fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    
        expect.soft(map).not.toHaveStyle(UNZOOMED_MAP_STYLE);
        expect.soft(controlContainer).not.toHaveStyle(UNZOOMED_CONTAINER_STYLE);
    })
})