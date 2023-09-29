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
    localStorage.setItem("userSettings", JSON.stringify(DEFAULTS.userSettings));

    const { result } = renderHook(() => useReadLocalStorage("userSettings"));

    expect(result.current).toStrictEqual(DEFAULTS.userSettings);
})

describe("key updates by useLocalStorage", () => {
    test("updates the value when the key is modified", () => {
        const { result: result1 } = renderHook(() => useLocalStorage("userSettings"));
        const { result: result2 } = renderHook(() => useReadLocalStorage("userSettings"));
    
        act(() => result1.current[1](modifiedSettings));
        expect.soft(result1.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(result2.current).toStrictEqual(modifiedSettings);
    });
    
    test("value isn't updated when another key is modified", () => {
        const { result: result1 } = renderHook(() => useLocalStorage("userSettings"));
        const { result: result2 } = renderHook(() => useReadLocalStorage("userLocation"));
    
        act(() => result1.current[1](modifiedSettings));
        expect.soft(result1.current[0]).toStrictEqual(modifiedSettings);
        expect.soft(result2.current).toBeNull();
    })
})

describe("key updates in another document", () => {
    test("updates the value when the key is modified", () => {
        const { result } = renderHook(() => useReadLocalStorage("userSettings"));
    
        act(() => {
            localStorage.setItem("userSettings", JSON.stringify(modifiedSettings));
            window.dispatchEvent(new StorageEvent("storage", { key: "userSettings" }));
        });
    
        expect.soft(result.current).toStrictEqual(modifiedSettings);
    })
    
    test("value isn't updated when another key is modified", () => {
        const { result } = renderHook(() => useReadLocalStorage("userSettings"));
    
        act(() => {
            localStorage.setItem("userSettings", JSON.stringify(DEFAULTS.userSettings));
            window.dispatchEvent(new StorageEvent("storage", { key: "userLocation" }));
        });
    
        expect.soft(result.current).toBeNull();
    })
})