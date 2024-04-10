import styled from "@emotion/styled";

import { centerFlex, mediaQueries, vars } from "ts/StyleMixins";

import Modal, { ModalContent } from "../Modal";


export default styled(Modal)({
    width: "90%",
    height: "90%",
    [mediaQueries.max("small")]: {
        width: "100%",
        paddingBottom: "20px",
    },
});

export const ChartTitle = styled.div([
    centerFlex, 
    {
        padding: "10px",
        justifyContent: "space-between",
        "select": {
            background: "transparent",
            border: "none",
            color: "inherit",
            fontSize: "2rem",
    
            "&:focus": { outline: "none" },
        }
    }
])

export const ChartContent = styled(ModalContent)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    padding: "10px",
    paddingTop: 0,

    ".recharts-responsive-container": {
        border: "1px solid #ffffff19",
        borderRadius: vars.borderRadius,
        overflow: "hidden",
    },
});

export const Option = styled.option({ backgroundColor: vars.background });
