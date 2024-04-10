import styled from "@emotion/styled";

import { centerFlex, varNames } from "ts/StyleMixins";


export const CenteredDisplay = styled.div([
    centerFlex,
    {
        height: "100%",
        flexDirection: "column",
        [varNames.svgSize]: "2rem",
    }
])