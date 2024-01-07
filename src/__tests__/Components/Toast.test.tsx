import React from "react";
import { act, render, screen } from "@testing-library/react";

import Toast from "Components/Toast";


function TestComponent({ isOpen }: { isOpen: boolean }) {
    const [open, setOpen] = React.useState(isOpen)

    return (
        <>
            <div id="toast-root"/>
            <button onClick={() => setOpen(true)}>Open Toast</button>
            <Toast 
                isOpen={open} 
                action={{  
                    content: "Dismiss",
                    onClick: () => setOpen(false),
                }}
            >
                My Toast
            </Toast>
        </>
    );
}

describe("toast-root", () => {
    test("When toast-root doesn't exist, the toast doesn't render", () => {
        render(<Toast isOpen={true}>My Toast</Toast>);
    
        expect(screen.queryByText("My Toast")).not.toBeInTheDocument()
    })
    
    test("When toast-root exists, the toast doesn't render if closed", () => {
        render(
            <>
                <div id="toast-root"/>
                <Toast isOpen={false}>My Toast</Toast>
            </>
        );
    
        expect(screen.queryByText("My Toast")).not.toBeInTheDocument()
    })
    
    test("When toast-root exists, the toast renders if open", () => {
        render(
            <>
                <div id="toast-root"/>
                <Toast isOpen={true}>My Toast</Toast>
            </>
        );
    
        expect(screen.queryByText("My Toast")).toBeInTheDocument()
    })
})

describe("Action", () => {
    test("When the action is provided a button is rendered", () => {
        render(
            <>
                <div id="toast-root"/>
                <Toast
                    isOpen={true}
                    action={{
                        content: "Dismiss",
                        onClick: () => {},
                    }}
                >
                    My Toast
                </Toast>
            </>
        )

        expect(screen.queryByRole("button")).toBeInTheDocument()
        expect(screen.queryByText("Dismiss")).toBeInTheDocument()
    })

    test("When the button is clicked, the function provided by action is called", () => {
        const onClick = vi.fn()

        render(
            <>
                <div id="toast-root"/>
                <Toast
                    isOpen={true}
                    action={{
                        content: "Dismiss",
                        onClick,
                    }}
                >
                    My Toast
                </Toast>
            </>
        )

        act(() => {
            screen.getByRole("button").click()
        })

        expect(onClick).toHaveBeenCalled()
    })
})

describe("Interaction", () => {
    test("When the toast has isOpen set to true, it opens", () => {
        render(<TestComponent isOpen={false}/>)
    
        expect(screen.queryByText("My Toast")).not.toBeInTheDocument()
    
        act(() => {
            screen.getByRole("button").click()
        })
    
        expect(screen.queryByText("My Toast")).toBeInTheDocument()
    })

    test("When the toast has isOpen set to false, it closes", () => {
        render(<TestComponent isOpen={true}/>)
    
        expect(screen.queryByText("My Toast")).toBeInTheDocument()
    
        act(() => {
            screen.getByText("Dismiss").click()
        })
    
        expect(screen.queryByText("My Toast")).not.toBeInTheDocument()
    })
})