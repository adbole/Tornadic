import styled from "@emotion/styled";

import { mediaQueries } from "ts/StyleMixins";

import Modal, { ModalContent } from "../Modal";


export default styled(Modal)({
    width: "90%",
    height: "80%",
    [mediaQueries.small]: {
        width: "100%",
        height: "60%",
        paddingBottom: "20px",
    },
});

export const ChartContent = styled(ModalContent)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    padding: "10px",
    paddingTop: 0,

    ".recharts-responsive-container": {
        border: "1px solid #ffffff19",
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
    },
});

export const Option = styled.option({ backgroundColor: "var(--widget-back)" });
