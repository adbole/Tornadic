import styled from "@emotion/styled";

import type { AnimationStage } from "Hooks/useAnimation";

import { Button } from "Components/Input";

import { vars } from "ts/StyleMixins";


export default styled.div<{ stage: AnimationStage }>(({ stage }) => [
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",

        backgroundColor: vars.background,
        borderRadius: vars.borderRadius,

        padding: "10px",
        transform: "translateY(120%)",
        transition: "transform 1s ease",

        [`${Button}`]: { margin: 0 },
        [`${Button} + ${Button}`]: {
            marginLeft: "5px",
        },
    },
    stage === "enter" && { transform: "translateY(0)" },
]);
