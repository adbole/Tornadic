import React from "react";
import ReactDOM from "react-dom";

import { useAnimation, useSameClick } from "Hooks";


export function ModalTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    const { children, className = "", ...excess } = props;

    return (
        <h1 className={"modal-title " + className} {...excess}>
            {children}
        </h1>
    );
}

export function ModalContent({ children }: { children: React.ReactNode }) {
    return <div className="modal-content">{children}</div>;
}

export type ModalProps = {
    isOpen: boolean;
    onClose: VoidFunction;
} & Omit<
    React.DialogHTMLAttributes<HTMLDialogElement>,
    "onClick" | "open" | "className" | "onClose"
>;

/**
 * A base modal to display simple information using the ModalContext
 */
export default function Modal({ isOpen, children, onClose, ...excess }: ModalProps) {
    const [openModal, closeModal, stage, shouldMount] = useAnimation(isOpen, 1000);

    const dialogRef = React.useRef<HTMLDialogElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            openModal();
        }
    }, [isOpen, openModal]);

    React.useEffect(() => {
        if (shouldMount) {
            dialogRef.current?.showModal();
            document.body.classList.add("hide-overflow");
        } else if (!shouldMount && stage === "leave") {
            onClose();
        }

        //Unmount should remove css
        return () => document.body.classList.remove("hide-overflow");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldMount, stage]);
    
    useSameClick(dialogRef, (e: MouseEvent) => {
        const target = e.target as HTMLElement

        if(target === dialogRef.current) 
            closeModal()
    })

    return shouldMount
        ? ReactDOM.createPortal(
              <dialog
                  className={`modal ${stage}`}
                  ref={dialogRef}
                  {...excess}
              >
                  {children}
              </dialog>,
              document.body
          )
        : null;
}
