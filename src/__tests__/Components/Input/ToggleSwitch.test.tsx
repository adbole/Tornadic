import { act, render, screen } from "@testing-library/react";

import { ToggleSwitch } from "Components";


test("Matches default snapshot", () => {
    const comp = render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            title="MyToggleSwitchTitle"
            onChange={() => undefined}
            defaultChecked={false}
        />
    )

    expect(comp).toMatchSnapshot()
})

test("Matches default checked snapshot", () => {
    const comp = render(
        <ToggleSwitch 
            label="MyToggleSwitch"
            onChange={() => undefined}
            defaultChecked={true}
        />
    )

    expect(comp).toMatchSnapshot()
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