import { renderHook, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";

import { usePermission } from "Hooks"


test("should return unknown when permission is not found", () => {
    const { result } = renderHook(() => usePermission("foo" as any));

    expect(result.current).toBe("unknown");
})

test("should return granted when permission is granted", async () => {
    (navigator.permissions.query as Mock).mockResolvedValue({ state: "granted" } as PermissionStatus);

    const { result } = renderHook(() => usePermission("geolocation"));

    await waitFor(() => expect(result.current).toBe("granted"));
})

test("should return denied when permission is denied", async () => {
    (navigator.permissions.query as Mock).mockResolvedValue({ state: "denied" } as PermissionStatus);

    const { result } = renderHook(() => usePermission("geolocation"));

    await waitFor(() => expect(result.current).toBe("denied"));
})

test("should return prompt when permission needs to be prompted", async () => {
    (navigator.permissions.query as Mock).mockResolvedValue({ state: "prompt" } as PermissionStatus);

    const { result } = renderHook(() => usePermission("geolocation"));

    await waitFor(() => expect(result.current).toBe("prompt"));
})