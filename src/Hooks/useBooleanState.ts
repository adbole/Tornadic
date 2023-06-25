import React from "react";

export default function useBooleanState(initialState: boolean): [boolean, () => void, () => void] {
    const [state, setState] = React.useState(initialState);

    const setTrue = React.useCallback(() => setState(true), []);
    const setFalse = React.useCallback(() => setState(false), []);

    return [state, setTrue, setFalse];
}