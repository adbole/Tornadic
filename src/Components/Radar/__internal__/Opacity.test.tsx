import { MapContainer, useMap } from "react-leaflet";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";

import Opacity from "./Opacity";


function WrapperInteraction({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            {children}
            <Opacity defaultOpacity={0.8} targetPane="tilePane" />
        </MapContainer>
    );
}

function WrapperWait({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            <Opacity defaultOpacity={0.8} targetPane="radar" />
            {children}
        </MapContainer>
    );
}

test("Matches snapshot", () => {
    const { container } = render(
        <MapContainer>
            <Opacity defaultOpacity={0.8} targetPane="tilePane" />
        </MapContainer>
    );

    expect(container).toMatchSnapshot();
});

test("Shows a slider and the current opacity", () => {
    render(
        <MapContainer>
            <Opacity defaultOpacity={0.37} targetPane="tilePane" />
        </MapContainer>
    );

    expect.soft(screen.queryByText("Opacity: 37")).toBeInTheDocument();
    expect.soft(screen.queryByRole("slider")).toBeInTheDocument();
});

test("Sets the target pane's opacity when slider is changed", () => {
    const {
        result: { current: map },
    } = renderHook(useMap, { wrapper: WrapperInteraction });

    const slider = screen.queryByRole("slider") as HTMLInputElement;

    act(() => {
        fireEvent.change(slider, { target: { value: 50 } });
    });

    expect.soft(map.getPane("tilePane")).toHaveStyle({ opacity: "0.5" });
});

test("If the target pane doesn't exist, then a mutation observer waits for its creation", () => {
    vi.spyOn(window.MutationObserver.prototype, "observe");

    const {
        result: { current: map },
    } = renderHook(useMap, { wrapper: WrapperWait });

    expect.soft(map.getPane("radar")).not.toBeTruthy();
    map.createPane("radar");

    const slider = screen.queryByRole("slider") as HTMLInputElement;

    act(() => {
        fireEvent.change(slider, { target: { value: 50 } });
    });

    expect.soft(window.MutationObserver.prototype.observe).toHaveBeenCalledOnce();
    expect.soft(map.getPane("radar")).toHaveStyle({ opacity: "0.5" });
});
