import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { darkBackBlur, mediaQueries, varNames, vars } from "ts/StyleMixins";


export const Base = css({
    backdropFilter: "none",
    ":before": {
        content: "''",
        position: "absolute",
        inset: 0,
        zIndex: -1,

        backdropFilter: "blur(10px)",
        boxShadow: "inset 0 0 0 200px rgba(255, 255, 255, 0.01)",
    },
    ".leaflet-center": {
        left: 0,
        right: 0,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
        gap: "10px",
        padding: "10px",

        maxWidth: "900px",
    },
    ".leaflet-control": [
        darkBackBlur,
        {
            borderRadius: vars.borderRadius,
            overflow: "hidden",
        },
    ],
    ".leaflet-custom-control, .leaflet-control-toggle": [
        darkBackBlur,
        {
            color: "white !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "2rem",
            minHeight: "2rem",
            border: "none",

            [varNames.svgSize]: "1.25rem",
        },
    ],
    ".leaflet-overlay-pane": { svg: { width: "unset" } },
    [mediaQueries.min("medium")]: { gridArea: "r" },
});

export default styled(Widget)(Base);
