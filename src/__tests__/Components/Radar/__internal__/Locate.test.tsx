import { MapContainer, useMap } from "react-leaflet";
import { setLocalStorageItem } from "__tests__/__utils__";
import { act, render, renderHook,screen } from "@testing-library/react";
import L from "leaflet";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Locate } from "Components/Radar/__internal__";


vi.spyOn(L.Map.prototype, "panTo");
vi.spyOn(L.Marker.prototype, "setLatLng")

vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Cursor: () => <span>Cursor</span>,
    LocationDot: () => <span>LocationDot</span>,
}))

beforeEach(() => {
    vi.clearAllMocks()
})

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            <Locate />
            {children}
        </MapContainer>
    );
}

test("On load, pans the map and moves the marker to the user's current location", () => {
    setLocalStorageItem("userLocation", {
        useCurrent: false,
        coords: {
            latitude: 35.5,
            longitude: -97.5
        }
    })

    render(
        <MapContainer>
            <Locate />
        </MapContainer>
    )

    const coords = {
        lat: 35.5,
        lng: -97.5
    } as L.LatLngExpression;

    expect.soft(L.Map.prototype.panTo).toHaveBeenCalledWith(coords);
    expect.soft(L.Marker.prototype.setLatLng).toHaveBeenCalledWith(coords);
    expect.soft(screen.queryByText("LocationDot")).toBeInTheDocument();
});

test("On load, does nothing if the user's location is not set", () => {
    setLocalStorageItem("userLocation", DEFAULTS.userLocation)

    render(
        <MapContainer>
            <Locate />
        </MapContainer>
    )

    expect.soft(L.Map.prototype.panTo).not.toHaveBeenCalled();
    expect.soft(L.Marker.prototype.setLatLng).not.toHaveBeenCalled();
    expect.soft(screen.queryByText("LocationDot")).not.toBeInTheDocument();
});

describe("Button", () => {
    test("Renders with the correct leaflet classes and other content/attributes", () => {
        render(
            <MapContainer>
                <Locate />
            </MapContainer>
        )

        const button = screen.getByTitle("Pan to current location");

        expect(button).toHaveClass("leaflet-custom-control", "leaflet-control");
        expect(screen.queryByText("Cursor")).toBeInTheDocument();
    })

    test("Pans the map to the user's current location when clicked", () => {
        setLocalStorageItem("userLocation", {
            useCurrent: false,
            coords: {
                latitude: 35.5,
                longitude: -97.5
            }
        })
        
        const { result: { current: map } } = renderHook(useMap, { wrapper: Wrapper });
    
        act(() => {
            map.panTo({
                lat: 0,
                lng: 0
            })
        })
    
        expect.soft(map.getCenter()).toStrictEqual({ lat: 0, lng: 0 })
    
        const button = screen.getByTitle("Pan to current location");
    
        button.click();
    
        const coords = {
            lat: 35.5,
            lng: -97.5
        } as L.LatLngExpression;
    
        expect.soft(L.Map.prototype.panTo).toHaveBeenLastCalledWith(coords);
        expect.soft(map.getCenter()).toStrictEqual(coords);
    });
    
})
