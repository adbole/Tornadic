import styled from "@emotion/styled";

import NowWidget, { Base as AlertBaseStyle } from "Components/Alert/style";
import AlertWidget, { Base as NowBaseStyle } from "Components/Now/style";
import Skeleton from "Components/Skeleton";
import WidgetContainer from "Components/Widget/style";

import { varNames } from "ts/StyleMixins";

import { ModalContent } from "../Modal";


export const NowSkeleton = styled(Skeleton)(NowBaseStyle);
export const AlertSkeleton = styled(Skeleton)(AlertBaseStyle);

export default styled(ModalContent)({
    padding: 0,

    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridAutoRows: "150px",

    [`${WidgetContainer}`]: {
        backdropFilter: "none",
        boxShadow: "none",
    },

    [`${NowSkeleton}, ${AlertSkeleton}, ${NowWidget}, ${AlertWidget}`]: { borderRadius: 0, },

});

export const ErrorMessage = styled.div({
    margin: "10px",
    textAlign: "center",
    gridColumn: " 1 / -1",
    [varNames.svgSize]: "2rem",
});
