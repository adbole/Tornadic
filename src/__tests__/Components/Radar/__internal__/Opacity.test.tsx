import { MapContainer } from "react-leaflet";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { Opacity } from "Components/Radar/__internal__";


vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    CircleSlashes: () => <span>CircleSlashes</span>,
}))

test("Shows a svg when not hovered", () => {
    render(
        <MapContainer>
            <Opacity value={100} setOpacity={() => undefined }/>
        </MapContainer>
    )

    expect(screen.queryByText("CircleSlashes")).toBeInTheDocument();
})

test("Shows a slider when hovered and resets on leave", () => {
    render(
        <MapContainer>
            <Opacity value={0.37} setOpacity={() => undefined }/>
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
            <Opacity value={0.37} setOpacity={() => undefined }/>
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

test("Calls setOpacity with the given value", () => {
    const setOpacity = vi.fn();

    render(
        <MapContainer>
            <Opacity value={0.37} setOpacity={setOpacity}/>
        </MapContainer>
    )

    const div = screen.getByText("CircleSlashes").parentElement as HTMLDivElement;

    act(() => {
        fireEvent.mouseEnter(div);
    })

    const slider = screen.queryByRole("slider") as HTMLInputElement;

    act(() => {
        fireEvent.change(slider, { target: { value: 50 } })
    })

    expect.soft(setOpacity).toHaveBeenCalledWith(0.5);
})

test("Clicking the div stops propagation", () => {
    const myClick = vi.fn();

    render(
        <MapContainer>
            <div onClick={myClick}>
                <Opacity value={0.37} setOpacity={() => undefined }/>
            </div>
        </MapContainer>
    )

    act(() => {
        fireEvent.click(screen.getByText("CircleSlashes").parentElement as HTMLDivElement);
    })

    expect(myClick).not.toHaveBeenCalled()
})