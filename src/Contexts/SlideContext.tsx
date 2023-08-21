import React from "react";
import styled from "@emotion/styled";

import { useAnimation, useNullableState } from "Hooks";

import { throwError } from "ts/Helpers";


const Container = styled.div({
    display: "flex",
    overflow: "hidden",

    "> div": { flex: "0 0 100%" },

    // DO NOT REMOVE
    // FIXES A BUG WITH ANIMATION ON SAFARI WHERE .slide-out
    // ELEMENTS MAY GET STUCK
    "> .slide-in": { zIndex: "1" },
});

const Context = React.createContext<Readonly<{
    slideTo: (value: NonNullable<React.ReactNode>) => void;
    reset: () => void;
}> | null>(null);

export const useSlide = () =>
    React.useContext(Context) ?? throwError("Please use useSlide inside a SlideContext provider");

function SlideContextProvider({ children }: { children: React.ReactNode }) {
    const [secondaryContent, slideTo, unsetSecondaryContent] = useNullableState<React.ReactNode>();
    const [doSlide, reset, stage, shouldMount] = useAnimation(false, 1000);

    const primaryDiv = React.useRef<HTMLDivElement>(null);
    const originalHeight = React.useRef<number>();

    React.useEffect(() => {
        if (!primaryDiv.current) return;

        //Get the original clientHeight.
        originalHeight.current = primaryDiv.current.clientHeight;
    }, []);

    React.useEffect(() => {
        if (secondaryContent) doSlide();
    }, [secondaryContent, doSlide]);

    React.useEffect(() => {
        if (!shouldMount) unsetSecondaryContent();
    }, [shouldMount, unsetSecondaryContent]);

    const value = React.useMemo(
        () => ({
            slideTo,
            reset,
        }),
        [slideTo, reset]
    );

    return (
        <Container
            className="slidable"
            style={{
                transition: "0.75s ease",
                maxHeight: stage === "enter" ? "100vh" : originalHeight.current + "px",
            }}
        >
            <Context.Provider value={value}>
                <div
                    ref={primaryDiv}
                    className={secondaryContent ? "slide-out" : ""}
                    style={{
                        transition: "1s ease",
                        marginLeft: stage === "enter" ? "-100%" : "initial",
                    }}
                >
                    {children}
                </div>
                {secondaryContent && <div className="slide-in">{secondaryContent}</div>}
            </Context.Provider>
        </Container>
    );
}

export default SlideContextProvider;
