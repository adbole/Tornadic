import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { alertColors } from "ts/StyleMixins";


export const Base = css({
    display: "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows: "1fr",
    padding: "0px",
    "> *": {
        paddingLeft: "10px",
        paddingRight: "10px",

        "&:first-of-type": { paddingTop: "10px" },
        "&:last-of-type": { paddingBottom: "10px" },
    },
});

export default styled(Widget)<{
    type: keyof typeof alertColors;
}>(({ type }) => [
    Base,
    {
        backgroundColor: alertColors[type].background,
        color: alertColors[type].foreground,
    },
]);

export const AlertInformation = styled.div({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
});

export const ExcessAlerts = styled.p({
    paddingTop: "10px",
    background: "rgba(0, 0, 0, 0.3)",
});
