import React from "react";

import { useAnimation, useNullableState } from "Hooks";

import { throwError } from "ts/Helpers";

import Container, { SlideContent } from "./SlideContext.style";


const Context = React.createContext<Readonly<{
    slideTo: (value: NonNullable<React.ReactNode>) => void;
    reset: () => void;
}> | null>(null);

export const useSlide = () =>
    React.useContext(Context) ?? throwError("Please use useSlide inside a SlideContext provider");

function SlideContextProvider({ children }: { children: React.ReactNode }) {
    const [secondaryContent, slideTo, unsetSecondaryContent] = useNullableState<React.ReactNode>();
    const [doSlide, reset, stage, shouldMount] = useAnimation(false, 1000);

    const originalHeight = React.useRef<number>();
    const secondaryHeight = React.useRef<number>();

    React.useEffect(() => {
        if (secondaryContent) doSlide();
    }, [secondaryContent, doSlide]);

    React.useEffect(() => {
        if (!shouldMount) {
            unsetSecondaryContent();
            secondaryHeight.current = undefined;
        }
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
            style={{
                transition: "0.75s ease",
                maxHeight:
                    stage === "enter"
                        ? Math.max(secondaryHeight.current ?? 0, originalHeight.current ?? 0) + "px"
                        : originalHeight.current + "px",
            }}
        >
            <Context.Provider value={value}>
                <SlideContent
                    ref={el => {
                        if (!el || originalHeight.current) return;

                        originalHeight.current = el.clientHeight;
                    }}
                    style={{
                        transition: "1s ease",
                        marginLeft: stage === "enter" ? "-100%" : "initial",
                    }}
                >
                    {children}
                </SlideContent>
                {secondaryContent && (
                    <SlideContent
                        style={{ zIndex: 1 }}
                        ref={el => {
                            if (!el || secondaryHeight.current) return;

                            secondaryHeight.current = [...el.children].reduce(
                                (height, child) => height + child.scrollHeight,
                                0
                            );
                        }}
                    >
                        {secondaryContent}
                    </SlideContent>
                )}
            </Context.Provider>
        </Container>
    );
}

export default SlideContextProvider;
