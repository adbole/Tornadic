import { MapContainer } from "react-leaflet";
import { render, screen } from "@testing-library/react";

import { ControlPortal, Position } from ".";


const positions = Object.entries(Position) as [string, Position][];

test.each(positions)("Renders the children in the %s position", (_, position) => {
    render(
        <MapContainer>
            <ControlPortal position={position}>
                <p>Hello World</p>
            </ControlPortal>
        </MapContainer>
    );

    expect(screen.getByText("Hello World").parentElement?.className).toContain(position);
});
