import React from "react";
import ReactDOM from "react-dom";

import { useAnimation, useNullableState } from "Hooks";

import { Button } from "../Input";

import Container from "./style";


export default function Toast({
    isOpen,
    children,
    actions,
}: {
    isOpen: boolean;
    children: React.ReactNode;
    actions?: {
        content: string;
        onClick: VoidFunction;
    }[];
}) {
    const [open, close, stage, shouldMount] = useAnimation(isOpen, 1000);
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
                  {
                    actions && (
                        <div>
                            {actions.map(({content, onClick}, i) => (
                                <Button 
                                    onClick={onClick} 
                                    key={content}
                                    varient={i !== 0 ? "secondary" : "primary"} 
                                >
                                    {content}
                                </Button>
                            ))}
                        </div>
                    )
                  }
              </Container>,
              portalRoot
          )
        : null;
}
