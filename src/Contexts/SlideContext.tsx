import React from "react";

import { useAnimation, useNullableState } from "Hooks";
import { Stage } from "Hooks/useAnimation";

import { throwError } from "ts/Helpers";


const Context = React.createContext<Readonly<{
    slideTo: (value: NonNullable<React.ReactNode>) => void
    reset: () => void
}> | null>(null);

export const useSlide = () => React.useContext(Context) ?? throwError("Please use useSlide inside a SlideContext provider");

const SlideContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [secondaryContent, slideTo, unsetSecondaryContent] = useNullableState<React.ReactNode>();
    const [doSlide, reset, stage, shouldMount] = useAnimation(false, 1000);

    const primaryDiv = React.useRef<HTMLDivElement>(null);
    const originalHeight = React.useRef<number>();

    React.useEffect(() => {
        if(!primaryDiv.current) return;

        //Get the original and set the original clientHeight.
        originalHeight.current = primaryDiv.current.clientHeight;
    }, []);

    React.useEffect(() => {
        if(secondaryContent)
            doSlide();
    }, [secondaryContent, doSlide]);

    React.useEffect(() => {
        if(!shouldMount && stage === Stage.LEAVE)
            unsetSecondaryContent();
    }, [shouldMount, unsetSecondaryContent, stage]);

    return (
        <div 
            className="slidable"
            style={{
                transition: "0.75s ease",
                maxHeight: stage === Stage.ENTER ? "100vh" : (originalHeight.current + "px")
            }}
        >
            <Context.Provider value={{ slideTo, reset }}>
                <div 
                    ref={primaryDiv}  
                    className={secondaryContent ? "slide-out" : ""}
                    style={{
                        transition: "1s ease",
                        marginLeft: stage === Stage.ENTER ? "-100%" : "initial"
                    }}
                >
                    {children}
                </div>
                {secondaryContent  && 
                    <div className="slide-in">
                        {secondaryContent}
                    </div>
                }
            </Context.Provider>
        </div>
    );
};

export default SlideContextProvider;