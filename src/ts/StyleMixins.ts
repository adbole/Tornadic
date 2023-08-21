import { css } from "@emotion/react";


export const mediaQueries = {
    large: "@media screen and (min-width: 1400px)",
    mediumMin: "@media screen and (min-width: 1100px)",
    mediumMax: "@media screen and (max-width: 1100px)",
    smallMin: "@media screen and (min-width: 800px)",
    smallMax: "@media screen and (max-width: 800px)",
} as const;

const baseVarNames = {
    background: "--background",
    backgroundLayer: "--background-layer",
    borderRadius: "--border-radius",
    inputBorderRadius: "--input-border-radius",

    svgSize: "--svg-size",

    primary: "--primary",

    zLayer1: "--z-layer-1",
    zLayer2: "--z-layer-2",
} as const;

//Proxy for varNames to prevent type-hinting when using 
//inside style attributes
export const varNames: {
    [K in keyof typeof baseVarNames]: any
} = baseVarNames;

export const vars = new Proxy(baseVarNames, {
    get(target, prop) {
        return `var(${target[prop as keyof typeof target]})`
    }
})

export const alertColors = {
    warning: {
        background: "#C31700",
        foreground: "white",
    },
    watch: {
        background: "#FFF501",
        foreground: "black",
    },
    advisory: {
        background: "#FF9431",
        foreground: "black",
    },
    statement: {
        background: "#8F00FF",
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

