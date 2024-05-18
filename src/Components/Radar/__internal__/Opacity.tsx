import React from "react";
import { useMap } from "react-leaflet";

import { Range } from "Components/Input";


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
        <label>
            <p style={{ textAlign: "center" }}>Opacity: {(value * 100).toFixed(0)}</p>
            <Range
                min={0}
                max={100}
                value={value * 100}
                step={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOpacity(e.currentTarget.valueAsNumber / 100)
                }
            />
        </label>
    );
}
