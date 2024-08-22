import styled from "@emotion/styled";

import { mediaQueries, vars } from "ts/StyleMixins";

import Modal, { ModalContent } from "../Modal";


export default styled(Modal)({
    width: "90%",
    height: "90%",
    [mediaQueries.max("small")]: {
        width: "100%",
        paddingBottom: "20px",
    },
});

export const ChartTitle = styled.div({
    position: "relative",
    textAlign: "center",
    padding: "10px",
    select: {
        background: "transparent",
        border: "none",
        color: "inherit",
        fontSize: "2rem",

        "&:focus": { outline: "none" },
    },
    ">:last-child": {
        position: "absolute",
        top: "10px",
        right: "10px",
    },
});

export const ChartContent = styled(ModalContent)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    padding: "10px",
    paddingTop: 0
});

export const Option = styled.option({ backgroundColor: vars.background });
