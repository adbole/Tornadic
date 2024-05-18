import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


const Track = css({
    borderRadius: vars.borderRadius,
    backgroundColor: "rgba(136, 136, 136, 0.5)",
});

const Thumb = css({
    WebkitAppearance: "none",
    appearance: "none",
    height: "10px",
    width: "10px",
    borderRadius: vars.borderRadius,
    backgroundColor: "#6498fa",
});

const Input = styled.input({
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",

    "&::-moz-range-track": [Track, { height: "10px" }],
    "&::-moz-range-thumb": [Thumb, { border: "none" }],
    "&::-webkit-slider-runnable-track": Track,
    "&::-webkit-slider-thumb": Thumb,
});

export default function Range(
    props: Omit<
        React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        "type" | "children"
    >
) {
    return <Input type="range" {...props} />;
}
