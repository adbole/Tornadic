import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


const Label = styled.label({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "5px 0px",
});

const Input = styled.input({
    appearance: "none",
    position: "relative",
    width: "4rem",
    height: "2rem",
    borderRadius: vars.borderRadius,
    backgroundColor: vars.backgroundLayer,
    transition: "background-color 0.3s ease",
    outline: "none",
    cursor: "pointer",

    "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "30%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        height: "1.25rem",
        width: "1.25rem",
        backgroundColor: "white",
        transition: "left 0.3s ease",
    },

    "&:checked": {
        backgroundColor: vars.primary,

        "&::after": { left: "70%" },
    },
});

function ToggleSwitch({
    label,
    title,
    defaultChecked,
    onChange,
}: {
    label: string;
    title?: string;
    defaultChecked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <Label title={title}>
            <Input type="checkbox" onChange={onChange} defaultChecked={defaultChecked} />
            <span>{label}</span>
        </Label>
    );
}

export default ToggleSwitch;
