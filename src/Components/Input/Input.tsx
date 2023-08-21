import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


export default styled.input({
    borderRadius: vars.inputBorderRadius,
    backgroundColor: vars.backgroundLayer,
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "inherit",
    padding: "5px",
});
