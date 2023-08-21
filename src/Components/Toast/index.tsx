import React from "react";
import ReactDOM from "react-dom";

import { useAnimation, useNullableState } from "Hooks";

import { Button } from "../Input";

import Container from "./style";


export default function Toast({
    isOpen,
    children,
    action,
}: {
    isOpen: boolean;
    children: React.ReactNode;
    action?: {
        content: string;
        onClick: VoidFunction;
    };
}) {
    const [open, close, stage, shouldMount] = useAnimation(isOpen, 5000);
    const [portalRoot, setPortalRoot] = useNullableState<HTMLElement>();

    React.useEffect(() => {
        if (isOpen) open();
        else close();
    }, [isOpen, open, close]);

    React.useEffect(() => {
        const root = document.getElementById("toast-root")!;

        setPortalRoot(root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return shouldMount && portalRoot
        ? ReactDOM.createPortal(
              <Container stage={stage}>
                  {children}
                  {action && <Button onClick={action.onClick}>{action.content}</Button>}
              </Container>,
              portalRoot
          )
        : null;
}
