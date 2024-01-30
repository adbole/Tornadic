import React from "react";


export default function useDragScroll<T extends HTMLElement>(
    containerRef: React.MutableRefObject<T | null>
) {
    const [dragActive, setDragActive] = React.useState(false);

    const hasHardStopped = React.useRef(false);
    
    const mouseStartX = React.useRef(0);
    const scrollLeft = React.useRef(containerRef.current?.scrollLeft);

    const momentumId = React.useRef<number | null>(null);
    const startTime = React.useRef(0);

    const cancelMomentum = () => {        
        if (momentumId.current === null) return;
        
        cancelAnimationFrame(momentumId.current);
        momentumId.current = null;
    };

    React.useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        let hardStopTimeout: NodeJS.Timeout | null = null;
        function onMouseMove(e: MouseEvent) {
            if (hardStopTimeout) clearTimeout(hardStopTimeout);

            e.preventDefault();

            const change = (e.pageX - mouseStartX.current);
            container.scrollLeft = scrollLeft.current! - change;

            hasHardStopped.current = false;
            hardStopTimeout = setTimeout(() => hasHardStopped.current = true, 100)
        }

        function onMouseDown(e: MouseEvent) {
            setDragActive(true);

            mouseStartX.current = e.pageX;
            scrollLeft.current = container.scrollLeft;

            startTime.current = performance.now();
            hasHardStopped.current = false;
            cancelMomentum();

            container.addEventListener("mousemove", onMouseMove);
        }

        function onMouseUp(e: MouseEvent) {
            container.removeEventListener("mousemove", onMouseMove);

            const distance = mouseStartX.current - e.pageX;

            const preventClick = () => container.addEventListener("click", (e) => e.stopPropagation(), { once: true });

            if(hasHardStopped.current) {
                preventClick();

                setDragActive(false);
                return;
            }

            if(Math.abs(distance) > 10) preventClick();

            const finish = performance.now();
            momentumId.current = requestAnimationFrame(() => momentumLoop(distance / (finish - startTime.current) * 10));
        }

        function onMouseLeave() {
            container.removeEventListener("mousemove", onMouseMove);
            cancelMomentum();
            setDragActive(false);
        }

        function momentumLoop(velocity: number) {
            container.scrollLeft += velocity;
            velocity *= 0.95;
            if (Math.abs(velocity) > 0.5) momentumId.current = requestAnimationFrame(() => momentumLoop(velocity));
            else {
                cancelMomentum();
                setDragActive(false);
            };
        }

        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseup", onMouseUp);
        container.addEventListener("mouseleave", onMouseLeave);

        return () => {
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseup", onMouseUp);
            container.removeEventListener("mouseleave", onMouseLeave);
        };
    }, [containerRef]);

    return dragActive
}
