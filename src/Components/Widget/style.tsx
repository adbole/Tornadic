import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";

import type { WidgetSize } from ".";


export const WidgetTitle = styled.h1({
    display: "flex",
    flexDirection: "row",
    gap: "5px",

    fontSize: "1rem",
    marginBottom: "10px",
})

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

        backdropFilter: "saturate(130%)",
        borderRadius: vars.borderRadius,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
    },
    size === "widget-large" && {
        minHeight: "300px",
        gridColumn: "span 2",
        gridRow: "span 2",
    },
    size === "widget-wide" && { gridColumn: "span 2" },
    !isTemplate && { [`> :not(${WidgetTitle})`] : { flex: 1 } },
]);
