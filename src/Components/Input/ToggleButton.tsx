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

function ToggleButton({
    label,
    name,
    defaultChecked = false,
    onClick,
}: {
    label: string;
    name: string;
    defaultChecked?: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
    const id = React.useId();

    return (
        <div>
            <Input
                type="radio"
                name={name}
                id={id}
                defaultChecked={defaultChecked}
                onClick={onClick}
            />
            <Label htmlFor={id}>{label}</Label>
        </div>
    );
}

export default ToggleButton;
