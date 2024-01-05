import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


export const Playback = styled.div([
    {
        display: "grid",
        gridTemplateColumns: "auto 1fr",

        maxWidth: "900px",
        width: "100%",
        height: "fit-content",
        padding: "10px",
        margin: "10px",
    },
]);

export const Time = styled.p({
    gridColumn: "span 2",
    textAlign: "center",
});

export const Timeline = styled.div({
    display: "flex",
    flexDirection: "column",
});

export const Slider = styled.input({
    WebkitAppearance: "none",
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",

    "&::-webkit-slider-runnable-track": {
        backgroundColor: "rgba(136, 136, 136, 0.5)",
        borderRadius: vars.borderRadius,
    },

    "&::-webkit-slider-thumb": {
        WebkitAppearance: "none",
        appearance: "none",
        height: "10px",
        width: "10px",
        borderRadius: vars.borderRadius,
        backgroundColor: "#6498fa",
    },
});

export const Datalist = styled.datalist({
    display: "flex",
    justifyContent: "space-between",
});

export const Option = styled.option({
    padding: "0px 1px",
    background: "rgba(136, 136, 136, 0.5)",
    borderRadius: vars.borderRadius,
});

export const Message = styled.h3({
    padding: "0.75rem",
    width: "100%",
    maxWidth: "300px",
    textAlign: "center"
})