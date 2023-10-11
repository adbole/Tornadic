import { act, render, renderHook, screen, waitFor } from "@testing-library/react"

import SlideContextProvider, { useSlide } from "Contexts/SlideContext"


const Child = "CHILD"
const Secondary = "SECONDARY"

function Wrapper() {
    return (
        <SlideContextProvider>
            <div data-testid={Child}/>
        </SlideContextProvider>
    )
}

test("Provided children is shown", () => {
    render(<Wrapper />)

    expect(screen.getByTestId(Child)).toBeInTheDocument()
})

test("Using useSlide outside of SlideContextProvider throws an error", () => {
    expect(() => useSlide()).toThrowError();
})

test("slideTo sets secondaryContent", () => {
    const { result } = renderHook(() => useSlide(), { wrapper: SlideContextProvider })

    act(() => {
        result.current.slideTo(<div data-testid={Secondary} />)
    })

    expect(screen.getByTestId(Secondary)).toBeInTheDocument()
})

test("reset unsets secondaryContent", async () => {
    const { result } = renderHook(() => useSlide(), { wrapper: SlideContextProvider })

    act(() => {
        result.current.slideTo(<div data-testid={Secondary} />)
    })

    act(() => {
        result.current.reset()
    })

    expect(screen.queryByTestId(Secondary)).not.toBeInTheDocument()

})