import styled from "@emotion/styled";

import { interactable, vars } from "ts/StyleMixins";


type ButtonProps = {
    varient?: "primary" | "transparent" | "secondary";
};

const padding = "5px 15px";

const Button = styled.button(({ varient = "primary" }: ButtonProps) => [
    interactable,
    {
        border: "none",
        borderRadius: vars.inputBorderRadius,
        fontSize: "inherit",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        margin: "5px 0px",
        color: "inherit",
    },
    varient === "primary" && {
        backgroundColor: vars.primary,
        padding,
    },
    varient === "secondary" && {
        backgroundColor: vars.backgroundLayer,
        padding,
    },
    varient === "transparent" && {
        backgroundColor: "transparent",
        boxShadow: "none",
        padding: 0,
    },
]);

Button.defaultProps = { type: "button" };

export default Button;
