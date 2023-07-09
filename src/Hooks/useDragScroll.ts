import { useEffect } from "react";


export default function useDragScroll<T extends HTMLElement>(containerRef: React.MutableRefObject<T | null>) {
    useEffect(() => {
        if(!containerRef.current) return;

        const container = containerRef.current;
        let isDown = false;
        let isMoving = false;

        let startX: number;
        let scrollLeft: number;

        //Momentum Trakcing
        let velX: number;
        let momentumId: number;

        function onClick(e: MouseEvent) {
            if(isMoving) {
                e.stopPropagation();
                isMoving = false;
            }
        }
        
        function onMouseDown(e: MouseEvent) {
            isDown = true;
            container.classList.add("drag-active");

            startX = e.pageX;
            scrollLeft = container.scrollLeft;
            //When there is velocity a click should stop it so prevent propagation
            if(Math.abs(velX) > 0) isMoving = true;
            velX = 0;
            cancelTrackMomentum();
        }

        function onMouseLeave() {
            isDown = false;
            if(Math.abs(velX) <= 0) {
                container.classList.remove("drag-active");
            }
        }

        function onMouseUp() {
            onMouseLeave();
            trackMomentum();
        }

        function onMouseMove(e: MouseEvent) {
            if(!isDown) return;
            e.preventDefault();

            isMoving = true;
            const change = (e.pageX - startX) * 1.5;
            const lastScroll = container.scrollLeft;

            container.scrollLeft = scrollLeft - change;
            velX = container.scrollLeft - lastScroll;
        }

        function trackMomentum() {
            cancelTrackMomentum();
            momentumId = requestAnimationFrame(momentumLoop);
        }

        function cancelTrackMomentum() {
            cancelAnimationFrame(momentumId);
        }

        function momentumLoop() {
            container.scrollLeft += velX;
            velX *= 0.95;
            if(Math.abs(velX) > 0.5) 
                momentumId = requestAnimationFrame(momentumLoop);
            else
                container.classList.remove("drag-active");
        }

        container.addEventListener("click", onClick);
        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseleave", onMouseLeave);
        container.addEventListener("mouseup", onMouseUp);
        container.addEventListener("mousemove", onMouseMove);

        return () => {
            container.removeEventListener("click", onClick);
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseleave", onMouseLeave);
            container.removeEventListener("mouseup", onMouseUp);
            container.removeEventListener("mousemove", onMouseMove);
        };
    }, [containerRef]);
}