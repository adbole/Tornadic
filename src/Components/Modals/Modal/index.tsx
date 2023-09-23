import React from "react";
import ReactDOM from "react-dom";
import { Global } from "@emotion/react";

import { useAnimation, useSameClick } from "Hooks";

import Dialog from "./style";


export type ModalProps = {
    isOpen: boolean;
    onClose: VoidFunction;
    children?: React.ReactNode;
    className?: string;
};

/**
 * A base modal to display simple information using the ModalContext
 */
export default function Modal({ isOpen, children, onClose, className }: ModalProps) {
    const [openModal, closeModal, stage, shouldMount] = useAnimation(isOpen, 1000);

    const dialogRef = React.useRef<HTMLDialogElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            openModal();
        }
    }, [isOpen, openModal]);

    React.useLayoutEffect(() => {
        if (shouldMount) {
            dialogRef.current?.showModal();
        } else {
            onClose();
        }
    }, [onClose, shouldMount]);

    useSameClick(dialogRef, (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (target === dialogRef.current) closeModal();
    });

    return shouldMount
        ? ReactDOM.createPortal(
              <>
                  <Global styles={{ body: { overflow: "hidden" } }} />
                  <Dialog
                      ref={dialogRef}
                      stage={stage}
                      onCancel={e => {
                          e.preventDefault();
                          closeModal();
                      }}
                      className={className}
                  >
                      {children}
                  </Dialog>
              </>,
              document.body
          )
        : null;
}

export { ModalContent, ModalTitle } from "./style";