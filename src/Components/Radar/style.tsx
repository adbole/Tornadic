import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { darkBackBlur, mediaQueries, varNames, vars } from "ts/StyleMixins";


export const Base = css({
    backdropFilter: "none",
    ".leaflet-center": {
        left: 0,
        right: 0,

        display: "flex",
        justifyContent: "center",
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
