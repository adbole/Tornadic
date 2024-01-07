import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { mediaQueries } from "ts/StyleMixins";


export const Base = css({
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5rem",
    padding: "60px 0px",
    
    [mediaQueries.max("medium")]: { gridColumn: "1 / -1" },
    [mediaQueries.min("medium")]: { gridArea: "n" },
});

export default styled(Widget)(Base);

export const Temperature = styled.h1({
    position: "relative",
    fontSize: "6rem",
    fontWeight: "200",

    "&::after": {
        position: "absolute",
        content: "'°'",
    },
});
