import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


const Input = styled.input({
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",

    "&::-webkit-slider-runnable-track": {
        backgroundColor: "rgba(136, 136, 136, 0.5)",
        borderRadius: vars.borderRadius,
    },

    "&::-webkit-slider-thumb": {
        WebkitAppearance: "none",
        appearance: "none",
        height: "10px",
        width: "10px",
        borderRadius: vars.borderRadius,
        backgroundColor: "#6498fa",
    },
});

export default function Range(
    props: Omit<
        React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        "type" | "children"
    >
) {
    return <Input type="range" {...props} />;
}
