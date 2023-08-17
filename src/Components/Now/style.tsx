import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button } from "Components/Input";
import Widget from "Components/Widget";

import { mediaQueries } from "ts/StyleMixins";


export const Base = css({
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5rem",
    padding: "60px 0px",
    [mediaQueries.mediumMin]: { "#root": { gridArea: "n" } }
});

export default styled(Widget)<{
    background: [string, string];
}>(({ background }) => [
    Base,
    { 
        background: `linear-gradient(to bottom, ${background[0]}, ${background[1]})` ,
        [mediaQueries.small]: {
            background: "none",
            backdropFilter: "none",
            boxShadow: "none"
        }
    },
]);

export const SettingsButton = styled(Button)({
    position: "absolute",
    left: "10px",
    top: "10px",
    margin: "0px",
    svg: { width: "1.5rem" },
});

export const Temperature = styled.h1({
    position: "relative",
    fontSize: "6rem",
    fontWeight: "200",

    "&::after": {
        position: "absolute",
        content: "'°'",
    },
});