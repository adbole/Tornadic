import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


export const Playback = styled.div([
    {
        display: "grid",
        gridTemplateColumns: "auto 1fr",

        width: "100%",
        height: "fit-content",
        padding: "10px",
    },
]);

export const Time = styled.p({
    gridColumn: "span 2",
    textAlign: "center",
    marginBottom: "5px",
});

export const Timeline = styled.div({
    display: "flex",
    flexDirection: "column",
});

export const TickArray = styled.div({
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 5px",
    height: "100%",
});

export const Tick = styled.div({
    padding: "0px 1px",
    background: "rgba(136, 136, 136, 0.5)",
    borderRadius: vars.borderRadius,
});

export const Message = styled.h3({
    padding: "0.75rem",
    width: "100%",
    maxWidth: "300px",
    textAlign: "center",
});
