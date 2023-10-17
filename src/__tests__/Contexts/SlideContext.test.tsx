import { act, render, renderHook, screen } from "@testing-library/react"

import SlideContextProvider, { useSlide } from "Contexts/SlideContext"


const child = "CHILD"
const secondary = "SECONDARY"

function Wrapper() {
    return (
        <SlideContextProvider>
            <div data-testid={child}/>
        </SlideContextProvider>
    )
}

test("Provided children is shown", () => {
    render(<Wrapper />)

    expect(screen.getByTestId(child)).toBeInTheDocument()
})

test("Using useSlide outside of SlideContextProvider throws an error", () => {
    expect(() => useSlide()).toThrowError();
})

test("slideTo sets secondaryContent", () => {
    const { result } = renderHook(() => useSlide(), { wrapper: SlideContextProvider })

    act(() => {
        result.current.slideTo(<div data-testid={secondary} />)
    })

    expect(screen.getByTestId(secondary)).toBeInTheDocument()
})

test("reset unsets secondaryContent", async () => {
    const { result } = renderHook(() => useSlide(), { wrapper: SlideContextProvider })

    act(() => {
        result.current.slideTo(<div data-testid={secondary} />)
    })

    expect.soft(screen.getByTestId(secondary)).toBeInTheDocument()

    act(() => {
        result.current.reset()
    })

    expect.soft(screen.queryByTestId(secondary)).not.toBeInTheDocument()

})