import { css } from "@emotion/react";


export const darkBackBlur = css({
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(10px)",
    color: "white",
});

export const center_flex = css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

export const inset = (value: string) =>
    css({
        top: value,
        left: value,
        right: value,
        bottom: value,
    });

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
