import { renderHook } from "@testing-library/react";

import { useUserLocation } from "Hooks";


describe("no_value", () => {
    test("if the userLocation key is not set", () => {
        const { result } = renderHook(() => useUserLocation());
    
        expect(result.current.status).toBe("no_value");
    })

    test("if useCurrent is false but coords aren't set", () => {
        localStorage.setItem("userLocation", JSON.stringify({ useCurrent: false }));
        const { result } = renderHook(() => useUserLocation());

        expect(result.current.status).toBe("no_value");
    })
})

describe("useCurrent", () => {
    test("nav isn't supported, nav_not_supported is returned", () => {
        localStorage.setItem("userLocation", JSON.stringify({ useCurrent: true }));
        const { result } = renderHook(() => useUserLocation());
    
        expect(result.current.status).toBe("nav_not_supported");
    })
})

test("returns OK with coords if coords are set in localStorage", () => {
    localStorage.setItem("userLocation", JSON.stringify({ useCurrent: false, coords: { latitude: 1, longitude: 1 } }));
    const { result } = renderHook(() => useUserLocation());

    expect(result.current.status).toBe("OK");
    expect(result.current.latitude).toBe(1);
    expect(result.current.longitude).toBe(1);
})