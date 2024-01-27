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
 * The modal can't be closed through setting isOpen to false.
 * Instead, the modal should be closed by its defined ways or by causing
 * onCancel or onClose to be called which can be done through forms.
 *
 * onClose should typically set the state controlling isOpen to false
 */
export default function Modal({ isOpen, children, onClose, className }: ModalProps) {
    const [openModal, closeModal, stage, shouldMount] = useAnimation(isOpen, 1000);

    const dialogRef = React.useRef<HTMLDialogElement | null>(null);
    const inTransition = React.useRef(isOpen);

    React.useEffect(() => {
        if (isOpen) openModal();
    }, [isOpen, openModal]);

    React.useEffect(() => {
        if (!shouldMount && stage === "leave") onClose();
    }, [onClose, shouldMount, stage]);

    React.useEffect(() => {
        if (!dialogRef.current) return;

        const ref = dialogRef.current;

        ref.addEventListener("transitionstart", () => (inTransition.current = true));
        ref.addEventListener("transitionend", () => (inTransition.current = false));

        return () => {
            ref.removeEventListener("transitionstart", () => (inTransition.current = true));
            ref.removeEventListener("transitionend", () => (inTransition.current = false));
        };
    }, [shouldMount]);

    useSameClick(dialogRef, (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        if (target === dialogRef.current && !inTransition.current) closeModal();
    });

    const ref = React.useCallback((el: HTMLDialogElement | null) => {
        el?.showModal();
        dialogRef.current = el;
    }, []);

    return shouldMount
        ? ReactDOM.createPortal(
              <>
                  <Global styles={{ body: { overflow: "hidden" } }} />
                  <Dialog
                      ref={ref}
                      stage={stage}
                      onCancel={e => {
                          e.preventDefault();
                          closeModal();
                      }}
                      onClose={() => {
                          //Ensure the modal doesn't close normally
                          dialogRef.current?.showModal();
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
