import { act, fireEvent, render, screen } from "@testing-library/react";

import { useBooleanState } from "Hooks";

import { mediaQueries, vars } from "ts/StyleMixins";

import Dialog from "./style";
import Modal, { ModalContent, ModalTitle } from ".";


const onClose = vi.fn();

function TestComponent({ defaultOpen = false }: { defaultOpen?: boolean }) {
    const [isOpen, setTrue, setFalse] = useBooleanState(defaultOpen);

    onClose.mockImplementation(setFalse);

    return (
        <>
            <button onClick={setTrue}>Open Modal</button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalTitle>Test Modal</ModalTitle>
                <ModalContent>Test Content</ModalContent>
            </Modal>
        </>
    );
}

beforeEach(() => {
    onClose.mockReset();
});

test("Renders nothing if isOpen is false", () => {
    render(<Modal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Renders a dialog if isOpen is true using showModal", () => {
    vi.spyOn(HTMLDialogElement.prototype, "showModal");

    render(<Modal isOpen={true} onClose={vi.fn()} />);

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
});

test("When isOpen is changed, the dialog is shown or hidden", () => {
    render(<TestComponent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
        screen.getByText("Open Modal").click();
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.queryByText("Test Modal")).toBeInTheDocument();
    expect.soft(screen.queryByText("Test Content")).toBeInTheDocument();
});

test("While transitioning, the dialog cannot be closed by click", async () => {
    vi.useFakeTimers();

    render(<TestComponent defaultOpen={true} />);

    await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
        fireEvent.mouseDown(screen.getByRole("dialog"));
        fireEvent.mouseUp(screen.getByRole("dialog"));
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();

    await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();

    vi.useRealTimers();
});

describe("Closing", () => {
    test("When the dialog's backdrop is clicked, onClose is called", async () => {
        render(<TestComponent defaultOpen={true} />);

        expect(screen.queryByRole("dialog")).toBeInTheDocument();

        act(() => {
            const dialog = screen.getByRole("dialog");

            //Animation must have ended for click to work
            fireEvent.transitionEnd(dialog);
            fireEvent.mouseDown(dialog);
            fireEvent.mouseUp(dialog);
        });

        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect.soft(onClose).toHaveBeenCalledOnce();
    });

    test("When the dialog's canceled event is fired, onClose is called", () => {
        render(<TestComponent defaultOpen={true} />);

        expect(screen.queryByRole("dialog")).toBeInTheDocument();

        act(() => {
            screen.getByRole("dialog").dispatchEvent(new Event("cancel"));
        });

        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect.soft(onClose).toHaveBeenCalledOnce();
    });

    test("When the dialog's close event is fired, onClose is called", () => {
        render(<TestComponent defaultOpen={true} />);

        expect(screen.queryByRole("dialog")).toBeInTheDocument();

        act(() => {
            screen.getByRole("dialog").dispatchEvent(new Event("close"));
        });

        expect.soft(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect.soft(onClose).toHaveBeenCalledOnce();
    });
});

test("If the mouse was dragged to the backdrop, onClose is not called", () => {
    render(<TestComponent defaultOpen={true} />);

    expect(screen.queryByRole("dialog")).toBeInTheDocument();

    act(() => {
        fireEvent.mouseDown(screen.getByText("Test Content"));
        fireEvent.mouseUp(screen.getByRole("dialog"));
    });

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(onClose).not.toHaveBeenCalled();
});

describe("Helpers", () => {
    test("ModalContent renders a div and matches snapshot", () => {
        const { container } = render(<ModalContent>Test Content</ModalContent>);

        expect.soft(screen.getByText("Test Content").tagName).toBe("DIV");
        expect.soft(container).toMatchSnapshot();
    });

    test("ModalTitle renders an h1 and matches snapshot", () => {
        const { container } = render(<ModalTitle>Test Title</ModalTitle>);

        expect.soft(screen.getByText("Test Title").tagName).toBe("H1");
        expect.soft(container).toMatchSnapshot();
    });
});

describe("Dialog style", () => {
    test("Matches idle snapshot", () => {
        const { container } = render(<Dialog stage="idle" />);

        expect(container).toMatchSnapshot();
    });

    test("Matches enter snapshot", () => {
        const { container } = render(<Dialog stage="enter" />);

        expect(container).toMatchSnapshot();
    });
});

describe("Responsive", () => {
    test("By default, the width if 500px with no max-height", () => {
        render(<Modal isOpen={true} onClose={vi.fn()} />);

        expect.soft(screen.queryByRole("dialog")).toHaveStyle({ width: "500px", maxHeight: "" });
    });

    test("Small screens have a set max-width, max-height, and are aligned to the bottom", () => {
        render(<Modal isOpen={true} onClose={vi.fn()} />);

        const dialog = screen.getByRole("dialog");

        expect
            .soft(dialog)
            .toHaveStyleRule("max-width", "100%", { media: mediaQueries.max("small") });
        expect
            .soft(dialog)
            .toHaveStyleRule("max-height", "75%", { media: mediaQueries.max("small") });
        expect
            .soft(dialog)
            .toHaveStyleRule("margin", "auto auto 0px auto", { media: mediaQueries.max("small") });
        expect
            .soft(dialog)
            .toHaveStyleRule("border-radius", `${vars.borderRadius} ${vars.borderRadius} 0px 0px`, {
                media: mediaQueries.max("small"),
            });
    });
});
