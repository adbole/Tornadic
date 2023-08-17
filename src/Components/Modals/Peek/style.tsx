import styled from "@emotion/styled";

import { Base as AlertBaseStyle } from "Components/Alert/style";
import { Base as NowBaseStyle } from "Components/Now/style";
import Skeleton from "Components/Skeleton";
import WidgetContainer from "Components/Widget/style";

import { ModalContent } from "../Modal";


export const NowSkeleton = styled(Skeleton)(NowBaseStyle);
export const AlertSkeleton = styled(Skeleton)(AlertBaseStyle);

export default styled(ModalContent)({
    padding: 0,

    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridAutoRows: "1fr",

    [`${WidgetContainer}`]: {
        backdropFilter: "none",
        boxShadow: "none",
        minHeight: "150px",
    },

    ".now, .alert": {
        gridColumn: "span 4",
        borderRadius: 0,
    },

    [`${WidgetContainer}:nth-last-of-type(-n + 4)`]: { gridColumn: "span 2" },
});

export const ErrorMessage = styled.div({
    margin: "10px",
    textAlign: "center",
    gridColumn: " 1 / -1",
    ">svg": { width: "2rem" },
});
