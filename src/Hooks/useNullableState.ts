import React from "react";


export default function useNullableState<T>(): [
    T | null,
    (value: NonNullable<T>) => void,
    () => void,
] {
    const [state, setState] = React.useState<T | null>(null);

    const setNonNull = React.useCallback((value: NonNullable<T>) => setState(value), []);
    const setNull = React.useCallback(() => setState(null), []);

    return [state, setNonNull, setNull];
}
