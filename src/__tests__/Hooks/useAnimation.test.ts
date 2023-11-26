import { act, renderHook } from "@testing-library/react";

import { useAnimation } from "Hooks";
import type { AnimationStage } from "Hooks/useAnimation"


const renderAnim = (state: boolean, timeout: number) => renderHook(() => useAnimation(state, timeout)).result.current;

test("should start in idle stage with false shouldMount", () => {
    const [, , stage, shouldMount] = renderAnim(false, 0);

    expect.soft(stage).toBe<AnimationStage>("idle");
    expect.soft(shouldMount).toBe(false);
});

test("should start in enter stage if default state is true with true shouldMount", () => {
    const [, , stage, shouldMount] = renderAnim(true, 0);

    expect.soft(stage).toBe<AnimationStage>("enter");
    expect.soft(shouldMount).toBe(true);
});

test("shouldMount sets to true followed by enter stage when state is set to true", async () => {
    const { result } = renderHook(() => useAnimation(false, 0));
    
    act(() => {
        result.current[0](); //setStateTrue
    })
        
    expect.soft(result.current[3]).toBe(true); //shouldMount
    expect.soft(result.current[2]).toBe<AnimationStage>("enter"); //stage
});

test("stage sets to idle followed by false shouldMount when state is set to false", async () => {
    const { result } = renderHook(() => useAnimation(true, 0));
    
    act(() => {
        result.current[1](); //setStateFalse
    })
        
    expect.soft(result.current[3]).toBe(false); //shouldMount
    expect.soft(result.current[2]).toBe<AnimationStage>("leave"); //stage
});