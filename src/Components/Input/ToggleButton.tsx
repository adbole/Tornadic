import React from "react";
import styled from "@emotion/styled";

import { interactable, vars } from "ts/StyleMixins";


const Label = styled.label(interactable, {
    display: "inline-block",
    width: "100%",
    padding: "5px",
    backgroundColor: vars.backgroundLayer,
    borderRadius: vars.inputBorderRadius,
    textAlign: "center",
    transition: "background-color 0.3s ease",
});

const Input = styled.input({
    display: "none",
    [`&:checked + ${Label}`]: { backgroundColor: vars.primary },
});

type Props = {
    label: React.ReactNode;
    type?: "radio" | "checkbox";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

function ToggleButton({ label, type = "radio", style, title, ...extra }: Props) {
    const id = React.useId();

    return (
        <div>
            <Input type={type} id={id} {...extra} />
            <Label htmlFor={id} style={style} title={title}>
                {label}
            </Label>
        </div>
    );
}

export default ToggleButton;
