import testIds from "@test-consts/testIDs";

import React from "react";

import Container, { WidgetTitle } from "./style";


export type WidgetSize = "widget-large" | "widget-wide" | "";

export type WidgetProps = {
    size?: WidgetSize;
    children: React.ReactNode;
    widgetTitle?: string;
    widgetIcon?: React.ReactNode;
    //Normal Widgets have a style rule that causes all child elements (excluding the title) to get flex: 1
    //so they take up as much space as possible. This flag will determine if it should be disabled.
    isTemplate?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * The base of all widgets in the Tornadic application.
 * This component will display a simple rectangle for display in a grid, but it can be expanded and customized to fit any need.
 */
const Widget = React.forwardRef<HTMLDivElement, WidgetProps>((props, ref) => {
    const {
        className,
        children,
        size = "",
        widgetTitle,
        widgetIcon,
        isTemplate,
        onClick,
        ...excess
    } = props;

    return (
        <Container
            size={size}
            isTemplate={isTemplate}
            ref={ref}
            className={className}
            {...excess}
            data-testid={testIds.Widget.WidgetSection}
            style={onClick && { cursor: "pointer" }}
            onClick={onClick}
        >
            {widgetTitle && widgetIcon && (
                <WidgetTitle>
                    {widgetIcon} {widgetTitle}
                </WidgetTitle>
            )}
            {children}
        </Container>
    );
});

export default Widget;
