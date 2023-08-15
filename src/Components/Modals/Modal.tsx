import React from "react";
import ReactDOM from "react-dom";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";

import { useAnimation, useSameClick } from "Hooks";
import type { AnimationStage } from "Hooks/useAnimation";


const Dialog = styled.dialog<{
    stage: AnimationStage;
}>(({ stage }) => [
    {
        color: "inherit",
        margin: "auto",
        width: "500px",
        backgroundColor: "var(--widget-back)",
        borderRadius: "var(--border-radius)",
        border: "none",
        padding: "0px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: "translateY(100vh)",
        transition: "transform 1s ease",

        "&::backdrop": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",

            opacity: 0,
            transition: "opacity 1s ease",
        },
    },
    stage === "enter" && {
        transform: "translateY(0)",
        "&::backdrop": { opacity: 1 },
    },
]);

export const ModalTitle = styled.h1({
    textAlign: "center",
    padding: "20px",

    ">*": {
        background: "transparent",
        border: "none",
        color: "inherit",
        fontSize: "inherit",

        "&:focus": { outline: "none" },
    },
});

export const ModalContent = styled.div({
    overflowY: "auto",
    padding: "20px",

    "h2, h3, h4, h5, h6": { fontWeight: 500 },

    hr: {
        height: "1px",
        backgroundColor: "#efdddd57",
        border: "none",
        margin: "5px",
    },

    "> p": { marginBottom: "10px" },
});

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
