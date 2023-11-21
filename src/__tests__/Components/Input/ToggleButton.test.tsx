import { act, render, screen } from "@testing-library/react"

import { ToggleButton } from "Components"


test("Matches default snapshot", () => {
    const comp = render(
        <ToggleButton 
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={() => undefined}
        />
    )

    expect(comp).toMatchSnapshot()
})

test("Unchecked by default", () => {
    render(
        <ToggleButton 
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={() => undefined}
        />
    )

    expect(screen.getByLabelText("MyToggleButton")).not.toBeChecked()
})

test("Checked if checked prop is true", () => {
    render(
        <ToggleButton 
            defaultChecked
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={() => undefined}
        />
    )

    expect(screen.getByLabelText("MyToggleButton")).toBeChecked()
})

test("Calls onClick when clicked", () => {
    const onClick = vi.fn()

    render(
        <ToggleButton 
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={onClick}
        />
    )

    const radio = screen.getByLabelText("MyToggleButton")

    act(() => {
        radio.click()
    })

    expect.soft(onClick).toHaveBeenCalledOnce()
    expect.soft(radio).toBeChecked()
})