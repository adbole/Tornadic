import { setLocalStorageItem } from "@test-utils";

import { act, fireEvent, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import { Settings } from ".";


vi.mock("svgs/widget", () => ({
    Gear: () => <span>Gear</span>,
}));

vi.mock("Components/Radar/__internal__/Opacity", () => ({
    default: () => <span>Opacity</span>,
}));

test("Matches Snapshot", () => {
    const { container } = render(<Settings />);

    expect(container).toMatchSnapshot();
});

test("When the gear is clicked, the settings popup is shown", () => {
    render(<Settings />);

    expect.soft(screen.queryByText("Opacity")?.parentElement).toHaveStyle({ display: "none" });

    act(() => {
        screen.getByText("Gear").click();
    });

    expect.soft(screen.queryByText("Opacity")?.parentElement).toHaveStyle({ display: "initial" });
});

describe("Changing Settings", () => {
    test("Default settings are loaded", () => {
        render(<Settings />);

        expect(localStorage).toHaveLocalItemValue("radarSettings", DEFAULTS.radarSettings);
    });

    test("Changing the color scheme", () => {
        render(<Settings />);

        const select = screen.getByLabelText("Color Scheme");

        act(() => {
            fireEvent.change(select, { target: { value: 8 } });
        });

        expect(localStorage).toHaveLocalItemValue("radarSettings", {
            ...DEFAULTS.radarSettings,
            colorScheme: 8,
        });
    });

    //Toggle Switches
    describe.each([
        ["Smooth Radar", "smoothing"],
        ["Show Snow", "snow"],
    ] as [string, keyof RadarSettings][])(`%s`, (label, prop) => {
        test.each([
            ["Off -> On", false, true],
            ["On -> Off", true, false],
        ] as [string, boolean, boolean][])(`%s`, (_, defaultState, newState) => {
            const defaults: RadarSettings = {
                ...DEFAULTS.radarSettings,
                [prop]: defaultState,
            };

            setLocalStorageItem("radarSettings", defaults);
            render(<Settings />);

            expect.soft(localStorage).toHaveLocalItemValue("radarSettings", defaults);

            const toggle = screen.getByLabelText<HTMLInputElement>(label);
            expect.soft(toggle.checked).toBe(defaultState);

            act(() => {
                toggle.click();
            });

            expect.soft(toggle.checked).toBe(newState);

            expect.soft(localStorage).toHaveLocalItemValue("radarSettings", {
                ...defaults,
                [prop]: newState,
            });
        });
    });
});
