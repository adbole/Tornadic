import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


type InputGroupProps = {
    hasGap?: boolean;
    isUniform?: boolean;
};

export default styled.div(({ hasGap = false, isUniform = false }: InputGroupProps) => [
    {
        display: "grid",
        gridAutoFlow: "column",
        margin: "5px 0px",

        ">*": { margin: 0 },
    },
    hasGap && { gap: "5px" },
    !hasGap && {
        borderRadius: vars.inputBorderRadius,
        overflow: "hidden",

        ">*": { "--input-border-radius": 0 },
        "> * + *": { borderLeft: "white 1px solid" },
    },
    isUniform && { gridAutoColumns: "1fr" },
]);
