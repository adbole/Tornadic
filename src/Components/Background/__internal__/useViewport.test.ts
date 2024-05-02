import { renderHook } from "@testing-library/react";

import useViewport from "./useViewport";


const mocks = vi.hoisted(() => ({
    useThree: vi.fn(),
    getCurrentViewport: vi.fn(() => ({ width: 1920, height: 1080 })),
}));

vi.mock("@react-three/fiber", () => ({
    useThree: mocks.useThree,
}));

test("Gets the current viewport", () => {
    mocks.useThree
        .mockReturnValueOnce({ position: [0, 0, 0] })
        .mockReturnValueOnce({ getCurrentViewport: mocks.getCurrentViewport });

    const { result } = renderHook(useViewport);

    const { width, height } = result.current;
    expect(width).toBe(1920);
    expect(height).toBe(1080);
    expect(mocks.getCurrentViewport).toHaveBeenCalledWith({ position: [0, 0, 0] }, [14.95, 0, -50]);
});
