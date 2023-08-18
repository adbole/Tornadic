import { css } from "@emotion/react";


export const mediaQueries = {
    large: "@media screen and (min-width: 1400px)",
    mediumMin: "@media screen and (min-width: 1100px)",
    mediumMax: "@media screen and (max-width: 1100px)",
    small: "@media screen and (max-width: 800px)",
};

export const vars = {
    background: "var(--background)",
    backgroundLayer: "var(--background-layer)",
    borderRadius: "var(--border-radius)",
    inputBorderRadius: "var(--input-border-radius)",

    primary: "var(--primary)",

    zLayer1: "var(--z-layer-1)",
    zLayer2: "var(--z-layer-2)",
}

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

