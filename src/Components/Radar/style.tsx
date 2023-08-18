import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { darkBackBlur, mediaQueries } from "ts/StyleMixins";


export const Base = css({
    backdropFilter: "none",
    "&::before": {
        content: '""',
        position: "absolute",
        inset: "0",
        backdropFilter: "saturate(130%)",
        borderRadius: "var(--border-radius)",
    },
    ".leaflet-center": {
        left: 0,
        right: 0,

        display: "flex",
        justifyContent: "center",
    },
    ".leaflet-control": [
        darkBackBlur,
        {
            borderRadius: "var(--border-radius)",
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

            "> svg": { width: "1.25rem" },
        },
    ],
    ".leaflet-overlay-pane": { "svg": { width: "unset" } },
    [mediaQueries.mediumMin]: { gridArea: "r" },
});

export default styled(Widget)(Base);
