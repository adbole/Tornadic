import { act, render, screen } from "@testing-library/react";

import ToggleButton from "./ToggleButton";


test("Matches default snapshot", () => {
    const { container } = render(
        <ToggleButton label="MyToggleButton" name="MyToggleButtonName" onClick={() => undefined} />
    );

    expect(container).toMatchSnapshot();
});

test("Renders radio button by default", () => {
    render(
        <ToggleButton label="MyToggleButton" name="MyToggleButtonName" onClick={() => undefined} />
    );

    expect(screen.getByLabelText("MyToggleButton")).toHaveAttribute("type", "radio");
});

test("Renders checkbox when type is checkbox", () => {
    render(
        <ToggleButton
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={() => undefined}
            type="checkbox"
        />
    );

    expect(screen.getByLabelText("MyToggleButton")).toHaveAttribute("type", "checkbox");
});

test("Unchecked by default", () => {
    render(
        <ToggleButton label="MyToggleButton" name="MyToggleButtonName" onClick={() => undefined} />
    );

    expect(screen.getByLabelText("MyToggleButton")).not.toBeChecked();
});

test("Checked if checked prop is true", () => {
    render(
        <ToggleButton
            defaultChecked
            label="MyToggleButton"
            name="MyToggleButtonName"
            onClick={() => undefined}
        />
    );

    expect(screen.getByLabelText("MyToggleButton")).toBeChecked();
});

test("Calls onClick when clicked", () => {
    const onClick = vi.fn();

    render(<ToggleButton label="MyToggleButton" name="MyToggleButtonName" onClick={onClick} />);

    const radio = screen.getByLabelText("MyToggleButton");

    act(() => {
        radio.click();
    });

    expect.soft(onClick).toHaveBeenCalledOnce();
    expect.soft(radio).toBeChecked();
});
