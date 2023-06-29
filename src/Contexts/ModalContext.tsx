/**
 * The Modal context provides a consitant way to display modals no matter the place in the DOM of the calling component. 
 */

import React from "react";
import ReactDOM from "react-dom";

import { useAnimation, useNullableState } from "Hooks";
import { Stage } from "Hooks/useAnimation";

import { throwError } from "ts/Helpers";

const Context = React.createContext<Readonly<{
    showModal: (value: NonNullable<React.ReactNode>) => void
    hideModal: () => void
}> | null>(null);

export const useModal = () => React.useContext(Context) ?? throwError("Please use useModal inside a ModalContext provider");

const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, showModal, hideModal] = useNullableState<React.ReactNode>();

    return (
        <Context.Provider value={{ showModal, hideModal }}>
            {children}
            {modal && ReactDOM.createPortal(modal, document.body)}
        </Context.Provider>
    );
};

export default ModalContextProvider;

export const ModalTitle = (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const { children, className = "", ...excess } = props;

    return (
        <h1 className={"modal-title " + className} {...excess}>{children}</h1>
    );
};

export const ModalContent = ({ children }: { children: React.ReactNode }) => (
    <div className="modal-content">
        {children}
    </div>
);

/**
 * A base modal to display simple information using the ModalContext
 */
export const Modal = (props: React.HTMLAttributes<HTMLDialogElement>) => {
    const { hideModal } = useModal();

    const [open, close, stage, shouldMount] = useAnimation(false, 1000);

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const { children, ...excess } = props;

    React.useEffect(() => {
        dialogRef.current?.showModal();
        open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if(!shouldMount && stage === Stage.LEAVE) 
            dialogRef.current?.close();
            
    }, [shouldMount, stage]);

    return (
        <dialog 
            className={`modal ${stage === Stage.ENTER ? "enter" : ""}`} 
            ref={dialogRef} 
            onClick={(e) => e.target === dialogRef.current && close()} 
            onClose={hideModal}
            {...excess}
        >
            {children}
        </dialog>
    );
};
