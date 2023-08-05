import React from "react";

import useBooleanState from "./useBooleanState";


type RequestId = {
    id?: number;
};

type Stage = "idle" | "enter" | "leave";

export default function useAnimation(
    defaultState: boolean,
    timeout: number
): [() => void, () => void, Stage, boolean] {
    const isReady = React.useRef(false);
    const requestId = React.useRef<RequestId>({});

    const [state, setStateTrue, setStateFalse] = useBooleanState(defaultState);

    const [stage, setStage] = React.useState<Stage>(state ? "enter" : "idle");
    const [shouldMount, setShouldMountTrue, setShouldMountFalse] = useBooleanState(state);

    React.useEffect(() => {
        cancelTimeoutAnimationFrame(requestId.current);

        //Animations should only fire after first renders
        if (!isReady.current) {
            isReady.current = true;
            return;
        }

        if (state) {
            setStage("idle");
            setShouldMountTrue();

            requestTimeoutAnimationFrame(() => setStage("enter"));
        } else {
            setStage("leave");
            requestTimeoutAnimationFrame(setShouldMountFalse, timeout);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => cancelTimeoutAnimationFrame(requestId.current);
    }, [setShouldMountFalse, setShouldMountTrue, state, timeout]);

    return [setStateTrue, setStateFalse, stage, shouldMount];
}

function requestTimeoutAnimationFrame(callback: () => void, timeout: number = 0) {
    const startTime = performance.now();
    const requestId: RequestId = {};

    const call = () => {
        requestId.id = requestAnimationFrame(now => {
            const elapsed = now - startTime;

            if (elapsed >= timeout) callback();
            else call();
        });
    };

    call();
    return requestId;
}

function cancelTimeoutAnimationFrame(requestId: RequestId) {
    if (requestId.id) cancelAnimationFrame(requestId.id);
}
