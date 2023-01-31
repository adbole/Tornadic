import React from "react";

export const Modal = (props: React.HTMLAttributes<HTMLDialogElement> & {
    modalTitle: string
    modalTitleClass: string
    onClose?: () => void;
}) => {
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
        <dialog className="modal" ref={dialogRef} {...excess} onClick={onClick}>
            <h1 className={modalTitleClass}>{modalTitle}</h1>
            <div className="modal-content">
                {children}
            </div>
        </dialog>
    );
};
