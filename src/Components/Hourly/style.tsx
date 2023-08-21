import styled from "@emotion/styled";

import Widget from "Components/Widget";

import { mediaQueries } from "ts/StyleMixins";


export default styled(Widget)(({ moveOver }: { moveOver: boolean }) => ({
    [mediaQueries.mediumMax]: { gridColumn: "span 2" },
    [mediaQueries.large]: [{ gridColumn: "span 6" }, moveOver && { gridColumn: "span 4" }],
}));

export const List = styled.ol({
    display: "flex",
    listStyleType: "none",
    padding: "0px",
    overflowY: "hidden",

    gap: "20px",
    cursor: "grab",

    "&.drag-active": { cursor: "grabbing" },
    "&:not(.drag-active)::-webkit-scrollbar-thumb": { backgroundColor: "transparent !important" },
});

export const Item = styled.li({
    display: "flex",
    flexDirection: "column",
    gap: "5px",

    "p": { 
        whiteSpace: "nowrap",
        textAlign: "center"
    },
    "> div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        flex: "1",

        svg: { width: "2rem" },
    },
});

export const Seperator = styled.li({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    "&::before, &::after": {
        content: '""',
        display: "inline-block",
        flex: "1 1 auto",
        width: "5px",
        backgroundColor: "white",
        borderRadius: "5px",
    },
});
