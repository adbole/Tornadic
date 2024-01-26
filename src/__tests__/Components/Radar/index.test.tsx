import testIds from "__tests__/__constants__/testIDs";
import { render, screen } from "@testing-library/react";

import { Radar } from "Components";

import { mediaQueries } from "ts/StyleMixins";


const mocks = vi.hoisted(() => ({
    AttributionControl: ({ position, prefix }: { position: string; prefix: string }) => (
        <span data-position={position} data-prefix={prefix}>
            AttributionControl
        </span>
    ),
    MapContainer: vi.fn(({ children }: { children: React.ReactNode }) => (
        <div>
            <span>MapContainer</span>
            {children}
        </div>
    )),
    TileLayer: ({
        position,
        prefix,
        className,
    }: {
        position: string;
        prefix: string;
        className: string;
    }) => (
        <span data-position={position} data-prefix={prefix} className={className}>
            TileLayer
        </span>
    ),
    ZoomControl: vi.fn(() => <span>ZoomControl</span>),
    ControlPortal: vi.fn(
        ({ position, children }: { position: string; children: React.ReactNode }) => (
            <div data-position={position}>
                <span>ControlPortal</span>
                {children}
            </div>
        )
    ),
}));

vi.mock("svgs/widget", () => ({ Map: () => <span>Map</span> }));

vi.mock("react-leaflet", async importOriginal => ({
    ...((await importOriginal()) as any),
    AttributionControl: mocks.AttributionControl,
    MapContainer: mocks.MapContainer,
    TileLayer: mocks.TileLayer,
    ZoomControl: mocks.ZoomControl,
}));

vi.mock("Components/Radar/__internal__", async importOriginal => ({
    ...((await importOriginal()) as any),
    AlertPolygons: () => <span>AlertPolygons</span>,
    ControlPortal: mocks.ControlPortal,
    Home: () => <span>Home</span>,
    Legend: () => <span>Legend</span>,
    Locate: () => <span>Locate</span>,
    Peek: () => <span>Peek</span>,
    RainViewer: () => <span>RainViewer</span>,
    Settings: () => <span>Settings</span>,
}));

test("Provides map with correct props", () => {
    render(<Radar />);

    //Map props
    expect.soft(mocks.MapContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
            center: [35.5, -97.5],
            zoom: 10,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false,
        }),
        expect.anything()
    );
});

test("Matches Snapshot", () => {
    const { container } = render(<Radar />);

    expect(container).toMatchSnapshot();
});

test("Radar has grid-area r down to medium screens", () => {
    render(<Radar />);

    expect(screen.getByTestId(testIds.Widget.WidgetSection)).toHaveStyleRule("grid-area", "r", {
        media: mediaQueries.min("medium"),
    });
});
