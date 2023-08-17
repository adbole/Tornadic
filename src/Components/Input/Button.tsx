import styled from "@emotion/styled";

import { interactable } from "ts/StyleMixins";


type ButtonProps = {
    varient?: "primary" | "text" | "transparent";
};

const Button = styled.button(({ varient = "primary" }: ButtonProps) => [
    interactable,
    {
        border: "none",
        borderRadius: "var(--input-border-radius)",
        fontSize: "inherit",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        margin: "5px 0px",
        color: "inherit",

        "&:hover, &:focus": { cursor: "pointer" },
    },
    varient === "primary" && {
        backgroundColor: "var(--primary)",
        padding: "5px 15px",
    },
    varient === "transparent" && {
        backgroundColor: "transparent",
        boxShadow: "none",
    },
]);

Button.defaultProps = { type: "button" };

export default Button;
