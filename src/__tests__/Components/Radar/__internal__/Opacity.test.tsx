import { MapContainer, useMap } from "react-leaflet";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";

import { Opacity } from "Components/Radar/__internal__";


vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    CircleSlashes: () => <span>CircleSlashes</span>,
}))

function WrapperInteraction({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            {children}
            <Opacity defaultOpacity={0.8} targetPane="tilePane"/>
        </MapContainer>
    )
}

function WrapperWait({ children }: { children: React.ReactNode }) {
    return (
        <MapContainer>
            <Opacity defaultOpacity={0.8} targetPane="radar"/>
            {children}
        </MapContainer>
    )
}

test("Shows a svg when not hovered", () => {
    render(
        <MapContainer>
            <Opacity defaultOpacity={0.8} targetPane="tilePane"/>
        </MapContainer>
    )

    expect(screen.queryByText("CircleSlashes")).toBeInTheDocument();
})

test("Shows a slider when hovered and resets on leave", () => {
    render(
        <MapContainer>
            <Opacity defaultOpacity={0.37} targetPane="tilePane"/>
        </MapContainer>
    )

    const div = screen.getByText("CircleSlashes").parentElement as HTMLDivElement;

    act(() => {
        fireEvent.mouseEnter(div);
    })

    expect.soft(screen.queryByText("Opacity: 37")).toBeInTheDocument();
    expect.soft(screen.queryByRole("slider")).toBeInTheDocument();

    act(() => {
        fireEvent.mouseLeave(div);
    })

    expect.soft(screen.queryByText("CircleSlashes")).toBeInTheDocument();
})

test("Slider hides when elsewhere is clicked", () => {
    render(
        <MapContainer>
            <Opacity defaultOpacity={0.37} targetPane="tilePane"/>
        </MapContainer>
    )

    const div = screen.getByText("CircleSlashes").parentElement as HTMLDivElement;

    act(() => {
        fireEvent.mouseEnter(div);
    })

    expect.soft(screen.queryByText("Opacity: 37")).toBeInTheDocument();
    expect.soft(screen.queryByRole("slider")).toBeInTheDocument();

    act(() => {
        fireEvent.click(document.body);
    })

    expect.soft(screen.queryByText("CircleSlashes")).toBeInTheDocument();
})

test("Sets the target pane's opacity when slider is changed", () => {
    const { result: { current: map } } = renderHook(useMap, { wrapper: WrapperInteraction });

    const div = screen.getByText("CircleSlashes").parentElement as HTMLDivElement;

    act(() => {
        fireEvent.mouseEnter(div);
    })

    const slider = screen.queryByRole("slider") as HTMLInputElement;

    act(() => {
        fireEvent.change(slider, { target: { value: 50 } })
    })

    expect.soft(map.getPane("tilePane")).toHaveStyle({ opacity: "0.5" });
})

test("If the target pane doesn't exist, then a mutation observer waits for its creation", () => {
    const { result: { current: map } } = renderHook(useMap, { wrapper: WrapperWait });
    
    expect.soft(map.getPane("radar")).not.toBeTruthy();
    map.createPane("radar");

    const div = screen.getByText("CircleSlashes").parentElement as HTMLDivElement;

    act(() => {
        fireEvent.mouseEnter(div);
    })

    const slider = screen.queryByRole("slider") as HTMLInputElement;

    act(() => {
        fireEvent.change(slider, { target: { value: 50 } })
    })

    expect.soft(map.getPane("radar")).toHaveStyle({ opacity: "0.5" });
})

test("Clicking the div stops propagation", () => {
    const myClick = vi.fn();

    render(
        <MapContainer>
            <div onClick={myClick}>
                <Opacity defaultOpacity={0.8} targetPane="tile"/>
            </div>
        </MapContainer>
    )

    act(() => {
        fireEvent.click(screen.getByText("CircleSlashes").parentElement as HTMLDivElement);
    })

    expect(myClick).not.toHaveBeenCalled()
})