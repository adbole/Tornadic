import { setLocalStorageItem } from "@test-utils";

import { act, render, screen } from "@testing-library/react";

import DEFAULTS from "Hooks/useLocalStorage.config";

import Settings from ".";


const saveAndCheck = (settings: UserSettings, defaults: UserSettings = DEFAULTS.userSettings) => {
    const saveBtn = screen.getByText("Save");

    expect.soft(localStorage).toHaveLocalItemValue("userSettings", defaults);
    expect.soft(saveBtn).not.toBeDisabled();

    act(() => {
        saveBtn.click();
    });

    expect.soft(localStorage).toHaveLocalItemValue("userSettings", settings);
    expect.soft(saveBtn).toBeDisabled();
};

test("Renders nothing if isOpen is false", () => {
    render(<Settings isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Renders a dialog if isOpen is true using showModal", () => {
    render(<Settings isOpen={true} onClose={vi.fn()} />);

    expect.soft(screen.queryByRole("dialog")).toBeInTheDocument();
    expect.soft(screen.queryByText("Settings")).toBeInTheDocument();
    expect.soft(screen.queryByText("Save")).toBeDisabled();
});

describe("Changing Settings", () => {
    test("Default settings are checked", () => {
        render(<Settings isOpen={true} onClose={vi.fn()} />);

        expect.soft(screen.queryByLabelText("Fahrenheit")).toBeChecked();
        expect.soft(screen.queryByLabelText("Inches")).toBeChecked();
        expect.soft(screen.queryByLabelText("mph")).toBeChecked();
        expect.soft(screen.queryByLabelText("Radar Alert Mode")).not.toBeChecked();

        expect.soft(localStorage).toHaveLocalItemValue("userSettings", DEFAULTS.userSettings);
    });

    //[Prepend, SwitchTo, Default, expected settings]
    test.each([
        ["Temp", "Fahrenheit", "Celsius", { tempUnit: "fahrenheit" } as UserSettings],
        ["Temp", "Celsius", "Fahrenheit", { tempUnit: "celsius" } as UserSettings],
        ["Precip", "Inches", "Milimeters", { precipitation: "inch" } as UserSettings],
        ["Precip", "Milimeters", "Inches", { precipitation: "mm" } as UserSettings],
        ["Wind", "mph", "Km/h", { windspeed: "mph" } as UserSettings],
        ["Wind", "Km/h", "mph", { windspeed: "kmh" } as UserSettings],
        ["Wind", "Knots", "mph", { windspeed: "kn" } as UserSettings],
    ])(`%s: %s`, (_, switchTo, defaultLabel, settings) => {
        const defaults: UserSettings = ["Fahrenheit", "Inches", "mph"].includes(switchTo)
            ? {
                  tempUnit: "celsius",
                  precipitation: "mm",
                  windspeed: "kn",
                  radarAlertMode: false,
                  preferGradient: false,
                  highContrastForLive: false
              }
            : DEFAULTS.userSettings;

        setLocalStorageItem("userSettings", defaults);
        render(<Settings isOpen={true} onClose={vi.fn()} />);

        const changeTo = screen.getByLabelText(switchTo);

        act(() => {
            changeTo.click();
        });

        expect.soft(changeTo).toBeChecked();
        expect.soft(screen.queryByLabelText(defaultLabel)).not.toBeChecked();

        saveAndCheck(
            {
                ...defaults,
                ...settings,
            },
            defaults
        );
    });

    //Toggle Switches
    describe.each([
        ["Radar Alert Mode", "radarAlertMode"],
        ["Prefer Gradients Over Live", "preferGradient"],
        ["High Foreground Contrast", "highContrastForLive"]
    ] as [string, keyof UserSettings][])
    (`%s`, (label, prop) => {
        test.each([
            ["Off -> On", false, true],
            ["On -> Off", true, false],
        ] as [string, boolean, boolean][])
        (`%s`, (_, defaultState, newState) => {
            const defaults: UserSettings = {
                ...DEFAULTS.userSettings,
                [prop]: defaultState,
            };
    
            setLocalStorageItem("userSettings", defaults);
            render(<Settings isOpen={true} onClose={vi.fn()} />);
    
            const toggle = screen.getByLabelText<HTMLInputElement>(label);
            expect.soft(toggle.checked).toBe(defaultState);
    
            act(() => {
                toggle.click();
            });
    
            expect.soft(toggle.checked).toBe(newState);
    
            saveAndCheck(
                {
                    ...defaults,
                    [prop]: newState,
                },
                defaults
            );
        });
    });


    test("Save button is disabled if settings are reverted to default before save", () => {
        render(<Settings isOpen={true} onClose={vi.fn()} />);
        const saveBtn = screen.getByText("Save");

        expect.soft(saveBtn).toBeDisabled();

        act(() => {
            screen.getByLabelText("Celsius").click();
        });

        expect.soft(screen.queryByLabelText("Celsius")).toBeChecked();
        expect.soft(saveBtn).not.toBeDisabled();

        act(() => {
            screen.getByLabelText("Fahrenheit").click();
        });

        expect.soft(screen.queryByLabelText("Fahrenheit")).toBeChecked();
        expect.soft(saveBtn).toBeDisabled();
    });
});
