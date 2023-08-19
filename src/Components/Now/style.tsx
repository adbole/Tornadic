import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { mediaQueries } from "ts/StyleMixins";


export const Base = css({
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5rem",
    padding: "60px 0px",
});

export default styled(Widget)<{
    background: [string, string];
}>(({ background }) => [
    Base,
    {
        background: `linear-gradient(to bottom, ${background[0]}, ${background[1]})`,
        "#root > &": {
            [mediaQueries.mediumMax]: {
                background: "none",
                backdropFilter: "none",
                boxShadow: "none",
                gridColumn: "1 / -1"
            },
            [mediaQueries.mediumMin]: { gridArea: "n" },
        }
},
]);

export const Temperature = styled.h1({
    position: "relative",
    fontSize: "6rem",
    fontWeight: "200",

    "&::after": {
        position: "absolute",
        content: "'°'",
    },
});
