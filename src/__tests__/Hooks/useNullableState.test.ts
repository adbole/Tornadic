import { act, renderHook } from "@testing-library/react";

import { useNullableState } from "Hooks";


test("should return the initial state", () => {
    const [state] = renderHook(() => useNullableState<string>()).result.current;
    expect(state).toBeNull();
})

test("should set the state to a non-null value when calling setNonNull", () => {
    const { result } = renderHook(() => useNullableState<string>());

    act(() => result.current[1]("Hello World"))
    expect(result.current[0]).toBe("Hello World");
})

test("should set the state to null when calling setNull", () => {
    const { result } = renderHook(() => useNullableState<string>());

    act(() => result.current[1]("Hello World"))
    expect.soft(result.current[0]).toBe("Hello World");

    act(() => result.current[2]())
    expect.soft(result.current[0]).toBeNull();
})