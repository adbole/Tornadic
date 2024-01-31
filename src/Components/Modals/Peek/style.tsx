import styled from "@emotion/styled";

import DailyWidget from "Components/Daily/style";
import HourlyWidget from "Components/Hourly/style";

import { varNames, vars } from "ts/StyleMixins";

import { ModalContent } from "../Modal";


export default styled(ModalContent)({
    padding: "10px",

    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridAutoRows: "150px",
    gap: "10px",

    [`${HourlyWidget}`] : {
        gridColumn: "span 2"
    },

    [`${DailyWidget}`] : {
        gridArea: "unset",
        gridColumn: "span 2",
        gridRow: "span 2"
    }
});

export const ErrorMessage = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: vars.borderRadius,

    background: vars.warn,
    color: "white",
    padding: "10px",
    gridColumn: " 1 / -1",

    [varNames.svgSize]: "2rem",
    svg: { fill: "white" },
});
