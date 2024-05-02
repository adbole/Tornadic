import styled from "@emotion/styled";

import type { AnimationStage } from "Hooks/useAnimation";

import { mediaQueries, vars } from "ts/StyleMixins";


export default styled.dialog<{
    stage: AnimationStage;
}>(({ stage }) => [
    {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",

        margin: "auto",
        padding: 0,
        width: "500px",

        color: "inherit",
        backgroundColor: vars.background,
        borderRadius: vars.borderRadius,
        border: "none",
        outline: "none",

        transform: "translateY(100vh)",
        transition: "transform 1s ease",
        "&::backdrop": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",

            opacity: 0,
            transition: "opacity 1s ease",
            cursor: "pointer",
        },
        [mediaQueries.max("small")]: {
            maxWidth: "100%",
            maxHeight: "75%",
            margin: "auto auto 0px auto",
            borderRadius: `${vars.borderRadius} ${vars.borderRadius} 0px 0px`,
            transform: "translateY(100%)",
        },
    },
    stage === "enter" && {
        transform: "translateY(0) !important",
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
