import { act, render, screen } from "@testing-library/react";

import { PlayPauseButton } from "Components/Radar/__internal__";


vi.mock("svgs/radar", async (importOriginal) => ({
    ...(await importOriginal() as any),
    Play: () => <div>Play</div>,
    Pause: () => <div>Pause</div>,
}))

test("Renders a play button on initial render", () => {
    render(<PlayPauseButton play={() => undefined} pause={() => true}/>)

    expect.soft(screen.queryByTitle("Play")).toBeInTheDocument()
    expect.soft(screen.queryByText("Play")).toBeInTheDocument()
})

test("When clicked, renders a pause button and calls play if pause returns false", () => {
    const play = vi.fn()

    render(<PlayPauseButton play={play} pause={() => false}/>)

    act(() => {
        screen.getByRole("button").click()
    })

    expect.soft(screen.queryByTitle("Pause")).toBeInTheDocument()
    expect.soft(screen.queryByText("Pause")).toBeInTheDocument()
    expect.soft(play).toHaveBeenCalledOnce()
})

test("When clicked, renders a play button if pause returns true", () => {
    const play = vi.fn()

    render(<PlayPauseButton play={play} pause={() => true}/>)

    act(() => {
        screen.getByRole("button").click()
    })

    expect.soft(screen.queryByTitle("Play")).toBeInTheDocument()
    expect.soft(screen.queryByText("Play")).toBeInTheDocument()
    expect.soft(play).not.toHaveBeenCalled()
})