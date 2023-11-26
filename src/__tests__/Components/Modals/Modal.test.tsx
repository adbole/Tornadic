import { act, fireEvent, render, screen } from "@testing-library/react";

import { useBooleanState } from "Hooks";

import { Modal, ModalContent, ModalTitle } from "Components";
import Dialog from "Components/Modals/Modal/style";

import { mediaQueries, vars } from "ts/StyleMixins";


const onClose = vi.fn();

function TestComponent({ defaultOpen = false }: { defaultOpen?: boolean }) {
    const [isOpen, setTrue, setFalse] = useBooleanState(defaultOpen);

    return (
        <>
            <button onClick={setTrue}>Open Modal</button>
            <Modal 
                isOpen={isOpen} 
                onClose={() => {
                    setFalse();
                    onClose();
                }}
            >
                <ModalTitle>Test Modal</ModalTitle>
                <ModalContent>Test Content</ModalContent>
            </Modal>
        </>
    )
}

beforeEach(() => {
    onClose.mockReset();
})


test("Renders nothing if isOpen is false", () => {
    render(<Modal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
});

test("Renders a dialog if isOpen is true using showModal", () => {
    vi.spyOn(HTMLDialogElement.prototype, "showModal");

    render(<Modal isOpen={true} onClose={vi.fn()} />);

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce()
})

test("When isOpen is changed, the dialog is shown or hidden", () => {
    render(<TestComponent />);

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()

    act(() => {
        screen.getByText("Open Modal").click()
    })

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(screen.getByText("Test Modal")).toBeInTheDocument()
    expect.soft(screen.getByText("Test Content")).toBeInTheDocument()
})

test("When the dialog's backdrop is clicked, onClose is called", () => {
    render(<TestComponent defaultOpen={true}/>);

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()

    act(() => {
        fireEvent.mouseDown(screen.getByRole("dialog"))
        fireEvent.mouseUp(screen.getByRole("dialog"))
    })

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect.soft(onClose).toHaveBeenCalledOnce()
})

test("When the dialog's canceled event is fired, onClose is called", () => {
    render(<TestComponent defaultOpen={true}/>);

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()

    act(() => {
        screen.getByRole("dialog").dispatchEvent(new Event("cancel"))
    })

    expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect.soft(onClose).toHaveBeenCalledOnce()
})

test("If the mouse was dragged to the backdrop, onClose is not called", () => {
    render(<TestComponent defaultOpen={true}/>);

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()

    act(() => {
        fireEvent.mouseDown(screen.getByText("Test Content"))
        fireEvent.mouseUp(screen.getByRole("dialog"))
    })

    expect.soft(screen.getByRole("dialog")).toBeInTheDocument()
    expect.soft(onClose).not.toHaveBeenCalled()
})

describe("Helpers", () => {
    test("ModalContent renders a div and matches snapshot", () => {
        const comp = render(<ModalContent>Test Content</ModalContent>);

        expect.soft(screen.getByText("Test Content").tagName).toBe("DIV")
        expect.soft(comp).toMatchSnapshot()
    })

    test("ModalTitle renders an h1 and matches snapshot", () => {
        const comp = render(<ModalTitle>Test Title</ModalTitle>);

        expect.soft(screen.getByText("Test Title").tagName).toBe("H1")
        expect.soft(comp).toMatchSnapshot()
    })
})

describe("Dialog style", () => {
    test("Matches idle snapshot", () => {
        const comp = render(<Dialog stage="idle"/>);

        expect(comp).toMatchSnapshot()
    })

    test("Matches enter snapshot", () => {
        const comp = render(<Dialog stage="enter"/>);

        expect(comp).toMatchSnapshot()
    })
})

describe("Responsive", () => {
    test("By default, the width if 500px with no max-height", () => {
        render(<Modal isOpen={true} onClose={vi.fn()} />)

        expect.soft(screen.getByRole("dialog")).toHaveStyle({ width: "500px", maxHeight: "" })
    })

    test("Small screens have a set max-width, max-height, and are aligned to the bottom", () => {
        render(<Modal isOpen={true} onClose={vi.fn()} />)

        const dialog = screen.getByRole("dialog");

        expect.soft(dialog).toHaveStyleRule("max-width", "100%", { media: mediaQueries.max("small") })
        expect.soft(dialog).toHaveStyleRule("max-height", "75%", { media: mediaQueries.max("small") })
        expect.soft(dialog).toHaveStyleRule("margin", "auto auto 0px auto", { media: mediaQueries.max("small") })    
        expect.soft(dialog).toHaveStyleRule("border-radius", `${vars.borderRadius} ${vars.borderRadius} 0px 0px`, { media: mediaQueries.max("small") })
    })
})