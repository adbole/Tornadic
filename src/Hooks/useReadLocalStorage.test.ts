import { dispatchStorage, setLocalStorageItem } from "@test-utils";

import { act, renderHook } from "@testing-library/react";

import { useLocalStorage, useReadLocalStorage } from "Hooks";
import DEFAULTS from "Hooks/useLocalStorage.config";


const modifiedSettings = {
    ...DEFAULTS.userSettings,
    tempUnit: "celsius",
} as UserSettings;

test("returns null when no value is stored", () => {
    const { result } = renderHook(() => useReadLocalStorage("userSettings"));

    expect(result.current).toBeNull();
});

test("returns the stored value", () => {
    setLocalStorageItem("userSettings", DEFAULTS.userSettings);

    const { result } = renderHook(() => useReadLocalStorage("userSettings"));

    expect(result.current).toStrictEqual(DEFAULTS.userSettings);
});

describe("key updates by useLocalStorage", () => {
    test("updates the value when the key is modified", () => {
        const { result: writeResult } = renderHook(() => useLocalStorage("userSettings"));
        const { result: readResult } = renderHook(() => useReadLocalStorage("userSettings"));

        act(() => writeResult.current[1](modifiedSettings));
        expect.soft(writeResult.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(readResult.current).toStrictEqual(modifiedSettings);
    });

    test("value isn't updated when another key is modified", () => {
        const { result: writeResult } = renderHook(() => useLocalStorage("userSettings"));
        const { result: readResult } = renderHook(() => useReadLocalStorage("userLocation"));

        act(() => {
            setLocalStorageItem("userLocation", DEFAULTS.userLocation);
            writeResult.current[1](modifiedSettings);
        });
        expect.soft(writeResult.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(readResult.current).toBeNull();
        expect.soft(localStorage).toHaveLocalItemValue("userLocation", DEFAULTS.userLocation);
    });
});

describe("key updates in another document", () => {
    test("updates the value when the key is modified", () => {
        const { result } = renderHook(() => useReadLocalStorage("userSettings"));

        act(() => {
            setLocalStorageItem("userSettings", modifiedSettings);
            dispatchStorage("userSettings");
        });

        expect.soft(result.current).toStrictEqual(modifiedSettings);
    });

    test("value isn't updated when another key is modified", () => {
        const { result } = renderHook(() => useReadLocalStorage("userSettings"));

        act(() => {
            setLocalStorageItem("userSettings", DEFAULTS.userSettings);
            dispatchStorage("userLocation");
        });

        expect.soft(result.current).toBeNull();
        expect.soft(localStorage).toHaveLocalItemValue("userSettings", DEFAULTS.userSettings);
    });
});
