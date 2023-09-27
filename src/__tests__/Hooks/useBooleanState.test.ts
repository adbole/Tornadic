import { act,renderHook } from '@testing-library/react';

import { useBooleanState } from 'Hooks';


const renderBoolean = (initialState: boolean) => renderHook(() => useBooleanState(initialState)).result.current;


describe('should return the initial state', () => {
    test("true", () => {
        const [state] = renderBoolean(true);
        expect(state).toBe(true);
    })

    test("false", () => {
        const [state] = renderBoolean(false);
        expect(state).toBe(false);
    })
});

test('should set the state to true when calling setTrue', () => {
    const { result } =renderHook(() => useBooleanState(false));

    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
});

test('should set the state to false when calling setFalse', () => {
    const { result } =renderHook(() => useBooleanState(true));

    act(() => result.current[2]());
    expect(result.current[0]).toBe(false);
});