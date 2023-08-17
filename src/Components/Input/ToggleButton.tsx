import React from "react";
import styled from "@emotion/styled";

import { interactable } from "ts/StyleMixins";


const Label = styled.label(interactable, {
    display: "inline-block",
    width: "100%",
    padding: "5px",
    backgroundColor: "var(--widget-back-layer)",
    borderRadius: "var(--input-border-radius)",
    textAlign: "center",
    transition: "background-color 0.3s ease",
});

const Input = styled.input({
    display: "none",
    [`&:checked + ${Label}`]: { backgroundColor: "var(--primary)" },
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
