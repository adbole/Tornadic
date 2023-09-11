import styled from "@emotion/styled";

import { Base as AlertBaseStyle } from "Components/Alert/style";
import { Base as NowBaseStyle } from "Components/Now/style";
import Skeleton from "Components/Skeleton";
import WidgetContainer from "Components/Widget/style";

import { varNames, vars } from "ts/StyleMixins";

import { ModalContent } from "../Modal";


export const NowSkeleton = styled(Skeleton)(NowBaseStyle);
export const AlertSkeleton = styled(Skeleton)(AlertBaseStyle);

export default styled(ModalContent)({
    padding: "10px",

    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridAutoRows: "150px",
    gap: "10px",

    [`${WidgetContainer}`]: {
        backdropFilter: "none",
        boxShadow: "none",
    },
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
