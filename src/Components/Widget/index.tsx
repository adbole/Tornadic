import React from "react";

import Container from "./style";


export type WidgetSize = "widget-large" | "widget-wide" | "";

export type WidgetProps = {
    size?: WidgetSize;
    children: React.ReactNode;
    widgetTitle?: string;
    widgetIcon?: React.ReactNode;
    //Normal Widgets have a style rule that causes all child elements (excluding the title) to get flex: 1
    //so they take up as much space as possible. This flag will determine if the template class is added to prevent it
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
        ...excess
    } = props;

    return (
        <Container size={size} isTemplate={isTemplate} ref={ref} className={className} {...excess}>
            {widgetTitle && widgetIcon && (
                <h1 className="widget-title">
                    {widgetIcon} {widgetTitle}
                </h1>
            )}
            {children}
        </Container>
    );
});

export default Widget;
