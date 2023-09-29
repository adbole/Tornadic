import { act,renderHook } from "@testing-library/react";

import { useOnlineOffline } from "Hooks";


test("returns true when the browser is online", () => {
    const { result } = renderHook(() => useOnlineOffline());
    expect(result.current).toBe(true);
});

test("returns false when the browser is offline", () => {
    const { result } = renderHook(() => useOnlineOffline());
    
    act(() => {
        window.dispatchEvent(new Event("offline"))
    })

    expect(result.current).toBe(false);
});