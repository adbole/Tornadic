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
    const [modal, setModal] = React.useState<React.ReactNode>(null);
    const hideModal = React.useCallback(() => setModal(null), []);

    return (
        <Context.Provider value={{showModal: setModal, hideModal: hideModal}}>
            {children}
            {modal && ReactDOM.createPortal(modal, document.body)}
        </Context.Provider>
    );
};

export default ModalContextProvider;

type ModalProps = React.HTMLAttributes<HTMLDialogElement> & {
    /** The title of the modal */
    modalTitle: string
    /** The className to be applied to the modal's title */
    modalTitleClass: string
}

/**
 * A base modal to display simple information using the ModalContext
 */
export const Modal = (props: ModalProps) => {
    const modalContext = useModal();

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const {children, modalTitle, modalTitleClass, ...excess} = props;

    React.useEffect(() => {
        if(!dialogRef.current) return;

        dialogRef.current.showModal();
        dialogRef.current.classList.add("enter-active");
        document.body.style.overflow = "hidden";
    }, [dialogRef]);

    function onClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
        e.currentTarget.classList.remove("enter", "enter-active");
        e.currentTarget.classList.add("leave", "leave-active");
        document.body.style.overflow = "unset";

        e.currentTarget.addEventListener('transitionend', (e) => {
            (e.currentTarget as HTMLDialogElement).close();
        });
    }

    return (
        <dialog className="modal enter" ref={dialogRef} onClick={onClick} onClose={() => modalContext.hideModal()} {...excess}>
            <h1 className={modalTitleClass}>{modalTitle}</h1>
            <div className="modal-content">
                {children}
            </div>
        </dialog>
    );
};
