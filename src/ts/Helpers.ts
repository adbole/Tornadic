import React from "react";

//Provides methods to normalize a value between to values to be between 0 and 1
export class Normalize {
    //Normalizes a value to be between 0 and 1 given it and the minimum and maximum values possible
    static Decimal(x: number, min: number, max: number) {
        return (x - min)/(max-min);
    }

    //Converts Decimal calculation to a percentage
    static Percent(x: number, min: number, max: number) {
        return Normalize.Decimal(x, min, max) * 100;
    }
}

//Converts the given Fahrenheit temperature to a hsl color
export const toHSL = (temp: number) => `hsl(${250 * ((120-temp)/120)}deg, 100%, 50%)`;

//Throws an error. For use in expressions where throw isn't allowed.
export const throwError = (msg: string) => { throw new Error(msg); };

//Helper method to ensure that a string matches a property on a type 
export const nameof = <T,>(name: Extract<keyof T, string>): string => name;

//An effect that will only run when the component is mounted
export const useMountedEffect = (func: React.EffectCallback, deps?: React.DependencyList | undefined) => {
    const ready = React.useRef(false);

    React.useEffect(() => {
        if(!ready.current) {
            ready.current = true;
            return;
        };

        return func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};