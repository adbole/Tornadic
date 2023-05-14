import React from "react";

const Context = React.createContext<{
    slideTo: React.Dispatch<React.SetStateAction<React.ReactNode>>
    reset: () => void
} | null>(null);

export function useSlideOver() {
    const contextInstance = React.useContext(Context);

    if(!contextInstance) {
        throw new Error("Please use useModal inside a ModalContext provider");
    } 
    else {
        return contextInstance;
    }
}

const SlideContextProvider = ({children}: {children: React.ReactNode}) => {
    const [secondaryContent, setSecondaryContent] = React.useState<React.ReactNode>(null);

    const wrapperDiv = React.useRef<HTMLDivElement>(null);
    const primaryDiv = React.useRef<HTMLDivElement>(null);
    const originalHeight = React.useRef<number>();

    React.useEffect(() => {
        if(!wrapperDiv.current || !primaryDiv.current) return;

        //Get the original and set the original clientHeight.
        originalHeight.current = primaryDiv.current.clientHeight;
        wrapperDiv.current.style.maxHeight = originalHeight.current + "px";
    }, []);

    //Transition to new height when secondary content is available
    React.useEffect(() => {
        if(!secondaryContent || !wrapperDiv.current) return;

        //Animate to 100vh, use wrapper around SelectContext to prestrict max-height further
        wrapperDiv.current.style.maxHeight = "100vh";
    }, [secondaryContent]);

    //Handles return transition
    const hideSecondaryContent = () => {
        if(!wrapperDiv.current || !primaryDiv.current || !originalHeight.current) return;
        
        primaryDiv.current.classList.remove("slide-out");
        wrapperDiv.current.style.maxHeight = originalHeight.current + "px";
        
        primaryDiv.current.addEventListener('transitionend', () => setSecondaryContent(null), {once: true});
    };

    return (
        <div ref={wrapperDiv} className="slidable">
            <Context.Provider value={{slideTo: setSecondaryContent, reset: hideSecondaryContent}}>
                <div ref={primaryDiv}  className={secondaryContent ? "slide-out" : ""}>
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