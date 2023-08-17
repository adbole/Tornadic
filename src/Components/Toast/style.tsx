import styled from "@emotion/styled";

import type { AnimationStage } from "Hooks/useAnimation";


export default styled.div<{ stage: AnimationStage }>(
    ({ stage }) => [
        {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--widget-back)",
            borderRadius: "var(--border-radius)",
            padding: "5px 10px",
            transform: "translateY(120%)",
            transition: "transform 1s ease"
        },
        stage === "enter" && { transform: "translateY(0)" }
    ]
);