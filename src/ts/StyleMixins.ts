import { css } from "@emotion/react";


const breakpoints = {
    large: 1400,
    medium: 1100,
    small: 800,
} as const;

type BreakpointKey = keyof typeof breakpoints;

export const mediaQueries = {
    min(
        key: BreakpointKey
    ): `@media screen and (min-width: ${(typeof breakpoints)[BreakpointKey]}px)` {
        return `@media screen and (min-width: ${breakpoints[key]}px)`;
    },
    max(
        key: BreakpointKey
    ): `@media screen and (max-width: ${(typeof breakpoints)[BreakpointKey]}px)` {
        return `@media screen and (max-width: ${breakpoints[key]}px)`;
    },
};

const baseVarNames = {
    background: "--background",
    backgroundLayer: "--background-layer",
    primary: "--primary",
    watch: "--watch",
    advise: "--advise",
    warn: "--warn",
    statement: "--statment",

    borderRadius: "--border-radius",
    inputBorderRadius: "--input-border-radius",

    svgSize: "--svg-size",

    zLayer1: "--z-layer-1",
    zLayer2: "--z-layer-2",
} as const;

//Proxy for varNames to prevent type-hinting when using
//inside style attributes
export const varNames: {
    [K in keyof typeof baseVarNames]: any;
} = baseVarNames;

export const vars = new Proxy(baseVarNames, {
    get(target, prop) {
        return `var(${target[prop as keyof typeof target]})`;
    },
});

export const alertColors = {
    warning: {
        background: vars.warn,
        foreground: "white",
    },
    watch: {
        background: vars.watch,
        foreground: "black",
    },
    advisory: {
        background: vars.advise,
        foreground: "black",
    },
    statement: {
        background: vars.statement,
        foreground: "white",
    },
    none: {
        background: "gray",
        foreground: "black",
    },
};

export const darkBackBlur = css({
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(10px)",
    color: "white",
});

export const centerFlex = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

export const interactable = css({
    transition: "filter 0.3s ease",
    filter: "brightness(100%)",

    "&:hover, &:focus": { cursor: "pointer" },

    "&:active, &:disabled": { filter: "brightness(70%)" },
});
