import testIds from "__tests__/__constants__/testIDs"
import { render, screen } from "@testing-library/react"

import { Radar } from "Components"

import { mediaQueries } from "ts/StyleMixins"


const mocks = vi.hoisted(() => ({
    AttributionControl: ({ position, prefix }: { position: string, prefix: string }) => (
        <span data-position={position} data-prefix={prefix}>AttributionControl</span>
    ),
    MapContainer: vi.fn(({ children }: { children: React.ReactNode }) => (
        <div>
            <span>MapContainer</span>
            {children}
        </div>
    )),
    TileLayer: ({ position, prefix, className }: { position: string, prefix: string, className: string }) => (
        <span data-position={position} data-prefix={prefix} className={className}>TileLayer</span>
    ),
    ZoomControl: vi.fn(() => <span>ZoomControl</span>),
    ControlPortal: vi.fn(({ position, children }: { position: string, children: React.ReactNode }) => (
        <div data-position={position}>
            <span>ControlPortal</span>
            {children}
        </div>
    )),
    Opacity: vi.fn(() => <span>Opacity</span>),
}))

vi.mock("svgs/widget", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Map: () => <span>Map</span>,
}))

vi.mock("react-leaflet", async (importOriginal) => ({
    ...(await importOriginal() as any),
    AttributionControl: mocks.AttributionControl,
    MapContainer: mocks.MapContainer,
    TileLayer: mocks.TileLayer,
    ZoomControl: mocks.ZoomControl,
}))

vi.mock("Components/Radar/__internal__", async (importOriginal) => ({
    ...(await importOriginal() as any),
    AlertPolygons: () => <span>AlertPolygons</span>,
    ControlPortal: mocks.ControlPortal,
    Home: () => <span>Home</span>,
    Locate: () => <span>Locate</span>,
    Opacity: mocks.Opacity,
    Peek: () => <span>Peek</span>,
    RainViewer: () => <span>RainViewer</span>,
}))

test("Renders as expected", () => {
    render(<Radar />)

    //Existance
    expect.soft(screen.queryByText("MapContainer")).toBeInTheDocument()
    expect.soft(screen.queryByText("TileLayer")).toBeInTheDocument()
    expect.soft(screen.queryByText("ZoomControl")).toBeInTheDocument()
    expect.soft(screen.queryByText("AttributionControl")).toBeInTheDocument()

    expect.soft(screen.queryByText("AlertPolygons")).toBeInTheDocument()
    expect.soft(screen.queryByText("ControlPortal")).toBeInTheDocument()
    expect.soft(screen.queryByText("Home")).toBeInTheDocument()
    expect.soft(screen.queryByText("Locate")).toBeInTheDocument()
    expect.soft(screen.queryByText("Opacity")).toBeInTheDocument()
    expect.soft(screen.queryByText("Peek")).toBeInTheDocument()
    expect.soft(screen.queryByText("RainViewer")).toBeInTheDocument()

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
    )
})

test("Matches Snapshot", () => {
    const { container } = render(<Radar />)

    expect(container).toMatchSnapshot()
})

test("Radar has grid-area r down to medium screens", () => {
    render(<Radar />)

    expect(screen.getByTestId(testIds.Widget.WidgetSection))
        .toHaveStyleRule("grid-area", "r", { media: mediaQueries.min("medium") })
})