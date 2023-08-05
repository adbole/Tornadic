import { useEffect } from "react";


export default function useSameClick<T extends HTMLElement>(
    containerRef: React.MutableRefObject<T | null>,
    onClick: (e: MouseEvent) => void
) {
    useEffect(() => {
        if (!containerRef.current) return;
        const element = containerRef.current;

        let downTarget: EventTarget | null;

        function onMouseDown(e: MouseEvent) {
            downTarget = e.target;
        }

        function onMouseUp(e: MouseEvent) {
            if (e.target === downTarget) {
                onClick(e);
            }
        }

        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("mouseup", onMouseUp);

        return () => {
            element.removeEventListener("mousedown", onMouseDown);
            element.removeEventListener("mouseup", onMouseUp);
        };
    }, [containerRef, onClick]);
}
