import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";

import { useAnimation, useNullableState } from "Hooks";

import { Button } from "../Input";


const Container = styled.div({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "var(--widget-back)",
    borderRadius: "var(--border-radius)",
    padding: "5px 10px",
});

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
    }, [isOpen, open]);

    React.useEffect(() => {
        const root = document.getElementById("toast-root")!;

        setPortalRoot(root);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return shouldMount && portalRoot
        ? ReactDOM.createPortal(
              <Container>
                  {children}
                  {action && (
                      <Button
                          onClick={() => {
                              action.onClick();
                              close();
                          }}
                      >
                          {action.content}
                      </Button>
                  )}
              </Container>,
              portalRoot
          )
        : null;
}
