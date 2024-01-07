import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";

import type { WidgetSize } from ".";


export const WidgetTitle = styled.h1({
    display: "flex",
    flexDirection: "row",
    gap: "5px",

    fontSize: "1rem",
    marginBottom: "10px",
});

export default styled.section<{
    size: WidgetSize;
    isTemplate?: boolean;
}>(({ size, isTemplate }) => [
    {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        padding: "10px",
        overflow: "hidden",

        backdropFilter: "blur(10px)",
        boxShadow: "inset 0 0 0 200px rgba(255, 255, 255, 0.01)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: vars.borderRadius,
    },
    size === "widget-large" && {
        minHeight: "300px",
        gridColumn: "span 2",
        gridRow: "span 2",
    },
    size === "widget-wide" && { gridColumn: "span 2" },
    !isTemplate && { [`> :not(${WidgetTitle})`]: { flex: 1 } },
]);
