import { act, render, screen } from "@testing-library/react";

import { ToggleSwitch } from "Components";


test("Matches snapshot", () => {
    const { container } = render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            title="MyToggleSwitchTitle"
            onChange={() => undefined}
            defaultChecked={false}
        />
    )

    expect(container).toMatchSnapshot()
})

test("Is not checked when defaultChecked is false", () => {
    render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            onChange={() => undefined}
            defaultChecked={false}
        />
    )

    expect(screen.getByLabelText("MyToggleSwitch")).not.toBeChecked()
})

test("Is checked by when defaultChecked is true", () => {
    render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            onChange={() => undefined}
            defaultChecked={true}
        />
    )

    expect(screen.getByLabelText("MyToggleSwitch")).toBeChecked()
})

test("onChange is called when clicked", () => {
    const onChange = vi.fn()

    render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            title="MyToggleSwitchTitle"
            onChange={onChange}
            defaultChecked={false}
        />
    )

    act(() => {
        screen.getByLabelText("MyToggleSwitch").click()
    })

    expect(onChange).toHaveBeenCalledOnce()
})