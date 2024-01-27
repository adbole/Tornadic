import { dispatchStorage, setLocalStorageItem } from "@test-utils";

import { act, renderHook } from "@testing-library/react";

import { useLocalStorage } from "Hooks";
import DEFAULTS from "Hooks/useLocalStorage.config";


const modifiedSettings = {
    ...DEFAULTS.userSettings,
    tempUnit: "celsius",
} as UserSettings;

test("sets the default values if none are stored", () => {
    const { result } = renderHook(() => useLocalStorage("userSettings"));

    expect.soft(result.current[0]).toStrictEqual(DEFAULTS.userSettings);
    expect.soft(localStorage).toHaveLocalItemValue("userSettings", DEFAULTS.userSettings);
});

test("sets the default values, if none are stored, to the overriden defaults if provided", () => {
    const { result } = renderHook(() => useLocalStorage("userSettings", modifiedSettings));

    expect.soft(result.current[0]).toStrictEqual(modifiedSettings);
    expect.soft(result.current[0]).not.toStrictEqual(DEFAULTS.userSettings);
    expect.soft(localStorage).toHaveLocalItemValue("userSettings", modifiedSettings);
});

test("stores a value using setValue and updates the state to said value", async () => {
    const { result } = renderHook(() => useLocalStorage("userSettings"));

    act(() => result.current[1](modifiedSettings));
    expect(result.current[0]).toStrictEqual(modifiedSettings);
    expect.soft(localStorage).toHaveLocalItemValue("userSettings", modifiedSettings);
});

test("setValue also allows functions and provides the old value as a param", async () => {
    const { result } = renderHook(() => useLocalStorage("userSettings"));

    const setFn = vi.fn((_: UserSettings) => modifiedSettings);

    act(() => result.current[1](setFn));
    expect.soft(result.current[0]).toStrictEqual(modifiedSettings);
    expect.soft(setFn).toHaveBeenCalledWith(DEFAULTS.userSettings);
    expect.soft(localStorage).toHaveLocalItemValue("userSettings", modifiedSettings);
});

describe("key updates by another useLocalStorage hook", () => {
    test("when a value is stored all hooks using the key are updated", () => {
        const { result: result1 } = renderHook(() => useLocalStorage("userSettings"));
        const { result: result2 } = renderHook(() => useLocalStorage("userSettings"));

        act(() => result1.current[1](modifiedSettings));
        expect.soft(result1.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(result2.current[0]).toStrictEqual(modifiedSettings);
    });

    test("during value updates, hooks using another key won't update even if new values exist", () => {
        const { result: result1 } = renderHook(() => useLocalStorage("userSettings"));
        const { result: result2 } = renderHook(() => useLocalStorage("userLocation"));

        act(() => {
            //Default is false
            setLocalStorageItem("userLocation", { useCurrent: true });
            result1.current[1](modifiedSettings);
        });

        expect.soft(result1.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(result2.current[0]).toStrictEqual(DEFAULTS.userLocation);
        expect.soft(result2.current[0]).not.toStrictEqual({ useCurrent: true });
    });
});

describe("key updates in another document", () => {
    test("updates the value when the key is modified", () => {
        const { result } = renderHook(() => useLocalStorage("userSettings"));

        act(() => {
            setLocalStorageItem("userSettings", modifiedSettings);
            dispatchStorage("userSettings");
        });

        expect.soft(result.current[0]).toStrictEqual(modifiedSettings);
    });

    test("doesn't update the value if another key is modified", () => {
        const { result } = renderHook(() => useLocalStorage("userSettings"));

        act(() => {
            setLocalStorageItem("userSettings", modifiedSettings);
            dispatchStorage("userLocation");
        });

        expect.soft(result.current[0]).toStrictEqual(DEFAULTS.userSettings);
    });
});
