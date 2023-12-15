import styled from "@emotion/styled";

import type { AnimationStage } from "Hooks/useAnimation";

import { mediaQueries, vars } from "ts/StyleMixins";


export default styled.dialog<{
    stage: AnimationStage;
}>(({ stage }) => [
    {
        display: "flex",
        flexDirection: "column",
        color: "inherit",
        margin: "auto",
        width: "500px",
        backgroundColor: vars.background,
        borderRadius: vars.borderRadius,
        border: "none",
        padding: 0,
        overflow: "hidden",
        transform: "translateY(100vh)",
        transition: "transform 1s ease",
        "&::backdrop": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",

            opacity: 0,
            transition: "opacity 1s ease",
        },
        [mediaQueries.max("small")]: {
            maxWidth: "100%",
            maxHeight: "75%",
            margin: "auto auto 0px auto",
            borderRadius: `${vars.borderRadius} ${vars.borderRadius} 0px 0px`,
        },
    },
    stage === "enter" && {
        transform: "translateY(0)",
        "&::backdrop": { opacity: 1 },
    },
]);

export const ModalTitle = styled.h1({
    textAlign: "center",
    padding: "20px",

    ">*": {
        background: "transparent",
        border: "none",
        color: "inherit",
        fontSize: "inherit",

        "&:focus": { outline: "none" },
    },
});

export const ModalContent = styled.div({
    overflowY: "auto",
    padding: "20px",

    "h2, h3, h4, h5, h6": { fontWeight: 500 },

    hr: {
        height: "1px",
        backgroundColor: "#efdddd57",
        border: "none",
        margin: "5px",
    },

    "> p": { marginBottom: "10px" },
});

export const CloseButton = styled.button({
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    backgroundColor: "transparent",
    color: "inherit",
    fontSize: "inherit",
    cursor: "pointer",

    padding: 0,
    width: "30px",
    height: "30px",

    transform: "rotate(45deg)",

    "--width": "3px",
    "--height": "100%",

    "&:before, &:after": {
        content: '""',
        position: "absolute",
        zIndex: -1,
        backgroundColor: "currentColor",
        borderRadius: "10px"

    },
    "&:before": {
        width: "var(--width)",
        height: "var(--height)",
        transform: "translate(-50%, -50%)",
    },
    "&:after": {
        width: "var(--height)",
        height: "var(--width)",
        transform: "translate(-50%, -50%)",
    }
});