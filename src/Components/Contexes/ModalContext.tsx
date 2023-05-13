/**
 * The Modal context provides a consitant way to display modals no matter the place in the DOM of the calling component. 
 */

import React from "react";
import ReactDOM from "react-dom";

const Context = React.createContext<{
    showModal: React.Dispatch<React.SetStateAction<React.ReactNode>>
    hideModal: () => void
} | null>(null);

export function useModal() {
    const contextInstance = React.useContext(Context);

    if(!contextInstance) {
        throw new Error("Please use useModal inside a ModalContext provider");
    } 
    else {
        return contextInstance;
    }
}

const ModalContextProvider = ({children}: {children: React.ReactNode}) => {
    const [modal, setModal] = React.useState<React.ReactNode>();
    const hideModal = React.useCallback(() => setModal(null), []);

    return (
        <Context.Provider value={{showModal: setModal, hideModal: hideModal}}>
            {children}
            {modal && ReactDOM.createPortal(modal, document.body)}
        </Context.Provider>
    );
};

export default ModalContextProvider;

export const ModalTitle = (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const {children, ...excess} = props;

    return (
        <h1 {...excess}>{children}</h1>
    );
};

export const ModalContent = ({children}: {children: React.ReactNode}) => (
    <div className="modal-content">
        {children}
    </div>
);

/**
 * A base modal to display simple information using the ModalContext
 */
export const Modal = (props: React.HTMLAttributes<HTMLDialogElement>) => {
    const {hideModal} = useModal();

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const {children, ...excess} = props;

    React.useEffect(() => {
        if(!dialogRef.current) return;

        dialogRef.current.showModal();
        dialogRef.current.classList.add("enter-active");
        document.body.style.overflow = "hidden";
    }, [dialogRef]);

    function onClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
        /*
            Target will be the element where the event propagated from. 
            Therefore, since the dialog is covered in targets that aren't itself
            we can say that if the dialog is the target then we must've clicked the backdrop
            as it has no other target elements on it.
        */
        if(e.target !== dialogRef.current) return;

        e.currentTarget.classList.remove("enter-active");
        e.currentTarget.classList.add("leave", "leave-active");
        document.body.style.overflow = "unset";

        dialogRef.current.addEventListener('transitionend', (e) => {
            (e.currentTarget as HTMLDialogElement).close();
        });
    }

    return (
        <dialog className="modal" ref={dialogRef} onClick={onClick} onClose={() => hideModal()} {...excess}>
            {children}
        </dialog>
    );
};
