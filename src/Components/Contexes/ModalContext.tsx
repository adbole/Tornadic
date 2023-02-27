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
        throw new Error("Please use useAlert inside a ModalContext provider");
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
 * 
 */
export const Modal = (props: ModalProps) => {
    const modalContext = useModal();

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const {children, modalTitle, modalTitleClass, ...excess} = props;

    React.useEffect(() => {
        if(!dialogRef.current) return;

        dialogRef.current.showModal();
    }, [dialogRef]);

    function onClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
        if(e.target === dialogRef.current) {
            dialogRef.current.close();
        }
    }

    return (
        <dialog className="modal" ref={dialogRef} onClick={onClick} onClose={() => modalContext.hideModal()} {...excess}>
            <h1 className={modalTitleClass}>{modalTitle}</h1>
            <div className="modal-content">
                {children}
            </div>
        </dialog>
    );
};
