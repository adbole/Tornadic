import styled from "@emotion/styled";

import type { WidgetSize } from ".";


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

        borderRadius: "var(--border-radius)",
        backdropFilter: "saturate(130%)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",

        ".widget-title": {
            display: "flex",
            flexDirection: "row",
            gap: "5px",

            fontSize: "1rem",
            marginBottom: "10px",
        },
    },
    size === "widget-large" && {
        minHeight: "300px",
        gridColumn: "span 2",
        gridRow: "span 2",
    },
    size === "widget-wide" && { gridColumn: "span 2" },
    !isTemplate && { "> :not(.widget-title)": { flex: 1 } },
]);