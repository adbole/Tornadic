import { css } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { mediaQueries } from "ts/StyleMixins";


export const Base = css({ [mediaQueries.min("medium")]: { gridArea: "d" } });
export default styled(Widget)(Base);

export const Column = styled.div({
    display: "flex",
    alignItems: "center",
    gap: "5px",
});

export const DualRange = styled.div({
    position: "relative",
    width: "100%",
    backgroundColor: "rgba(89, 89, 89, 0.5)",
    borderRadius: "5px",
    height: "10px",
});

export const Covered = styled.div({
    position: "absolute",
    borderRadius: "5px",
    height: "100%",
});

export const Row = styled.div({
    display: "flex",
    alignItems: "center",
    flex: 1,
    "&:hover": {
        filter: "brightness(80%)",
        cursor: "pointer",
    },
    "&:active": { filter: "brightness(70%)" },
});

export const List = styled.div({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    "> div + div": { borderTop: "1px solid rgba(100, 100, 100, 0.25)" },
});
