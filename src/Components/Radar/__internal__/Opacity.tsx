import React from "react";
import { useMap } from "react-leaflet";
import styled from "@emotion/styled";

import { useBooleanState } from "Hooks";

import { CircleSlashes } from "svgs/radar";


const Container = styled.div({
    padding: "10px",
    ">p": { textAlign: "center" },
});

export default function Opacity({ 
    defaultOpacity, 
    targetPane
}: { 
    defaultOpacity: number ,
    targetPane: string
}) {
    const map = useMap();

    const [hover, setHoverTrue, setHoverFalse] = useBooleanState(false);
    const [value, setOpacity] = React.useState(defaultOpacity);
    
    //Fallback for touch devices
    React.useEffect(() => {
        document.body.addEventListener("click", setHoverFalse);
        return () => document.body.removeEventListener("click", setHoverFalse);
    }, [setHoverFalse]);

    React.useEffect(() => {
        const pane = map.getPane(targetPane);
        if(!pane) {
            const observer = new MutationObserver((_, observer) => {
                const pane = map.getPane(targetPane);
                
                if(!pane) return;

                pane.style.opacity = value.toString();

                observer.disconnect();
            })

            observer.observe(map.getContainer(), { childList: true, subtree: true });

            return;
        };

        pane.style.opacity = value.toString();
    }, [map, targetPane, value])

    return (
        <div
            className="leaflet-custom-control leaflet-control"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            onMouseEnter={setHoverTrue}
            onMouseLeave={setHoverFalse}
        >
            {!hover && <CircleSlashes />}
            {hover && (
                <Container>
                    <p>Opacity: {(value * 100).toFixed(0)}</p>
                    <input
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
            )}
        </div>
    );
}
