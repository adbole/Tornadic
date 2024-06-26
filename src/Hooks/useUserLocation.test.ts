import { setLocalStorageItem } from "@test-utils";

import { renderHook } from "@testing-library/react";
import type { Mock } from "vitest";

import { useUserLocation } from "Hooks";


describe("no_value", () => {
    test("if the userLocation key is not set", () => {
        const { result } = renderHook(() => useUserLocation());

        expect(result.current.status).toBe("no_value");
    });

    test("if useCurrent is false but coords aren't set", () => {
        setLocalStorageItem("userLocation", { useCurrent: false });
        const { result } = renderHook(() => useUserLocation());

        expect(result.current.status).toBe("no_value");
    });
});

describe("useCurrent", () => {
    test("nav isn't supported, nav_not_supported is returned", () => {
        vi.stubGlobal("navigator", { geolocation: null });

        setLocalStorageItem("userLocation", { useCurrent: true });
        const { result } = renderHook(() => useUserLocation());

        expect(result.current.status).toBe("nav_not_supported");

        vi.unstubAllGlobals();
    });

    test.each([
        ["denied", 1],
        ["unavailable", 2],
        ["timeout", 3],
    ])(`Returns %s if getCurrentPosition raises an error for it`, (status, code) => {
        (navigator.geolocation.getCurrentPosition as Mock).mockImplementationOnce((_, cb) => {
            cb({
                code,
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3,
            } as GeolocationPositionError);
        });

        setLocalStorageItem("userLocation", { useCurrent: true });
        const { result } = renderHook(() => useUserLocation());

        expect(result.current.status).toBe(status);
    });

    test("returns OK with coords if getCurrentPosition returns a position", () => {
        setLocalStorageItem("userLocation", { useCurrent: true });
        const { result } = renderHook(() => useUserLocation());

        expect.soft(result.current.status).toBe("OK");
        expect.soft(result.current.latitude).toBe(1);
        expect.soft(result.current.longitude).toBe(1);
    });
});

test("returns OK with coords if coords are set in localStorage", () => {
    setLocalStorageItem("userLocation", {
        useCurrent: false,
        coords: { latitude: 10, longitude: 10 },
    });
    const { result } = renderHook(() => useUserLocation());

    expect.soft(result.current.status).toBe("OK");
    expect.soft(result.current.latitude).toBe(10);
    expect.soft(result.current.longitude).toBe(10);
});

test("returns getting_current while awaiting getCurrentPosition to call callbacks", () => {
    (navigator.geolocation.getCurrentPosition as Mock).mockImplementationOnce(() => {});

    setLocalStorageItem("userLocation", { useCurrent: true });
    const { result } = renderHook(() => useUserLocation());

    expect.soft(result.current.status).toBe("getting_current");
});
