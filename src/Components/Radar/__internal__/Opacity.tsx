import React from "react";
import { useMap } from "react-leaflet";
import styled from "@emotion/styled";

import { vars } from "ts/StyleMixins";


const Container = styled.div({
    ">p": { textAlign: "center" },
});

const Range = styled.input({
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
})

export default function Opacity({
    defaultOpacity,
    targetPane,
}: {
    defaultOpacity: number;
    targetPane: string;
}) {
    const map = useMap();

    const [value, setOpacity] = React.useState(defaultOpacity);

    React.useEffect(() => {
        const pane = map.getPane(targetPane);
        if (!pane) {
            const observer = new MutationObserver((_, observer) => {
                const pane = map.getPane(targetPane);

                if (!pane) return;

                pane.style.opacity = value.toString();

                observer.disconnect();
            });

            observer.observe(map.getContainer(), { childList: true, subtree: true });

            return;
        }

        pane.style.opacity = value.toString();
    }, [map, targetPane, value]);

    return (
        <Container>
            <p>Opacity: {(value * 100).toFixed(0)}</p>
            <Range
                type="range"
                min={0}
                max={100}
                value={value * 100}
                step={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOpacity(e.currentTarget.valueAsNumber / 100)
                }
            />
        </Container>
    );
}
