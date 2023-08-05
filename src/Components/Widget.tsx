import React from "react";

import { cleanClass } from "ts/Helpers";

// #region Widget
export type WidgetSize = "widget-large" | "widget-wide";

type WidgetProps = {
    size?: WidgetSize;
    children: React.ReactNode;
    widgetTitle?: string;
    widgetIcon?: React.ReactNode;
    //Normal Widgets have a style rule that causes all child elements (excluding the title) to get flex: 1
    //so they take up as much space as possible. This flag will determine if the template class is added to prevent it
    isTemplate?: boolean;
};

/**
 * The base of all widgets in the Tornadic application. Everything is a widget and it all starts here.
 * This component will display a simple rectangle box in the root's grid, but can be expanded and customized to fit any need.
 */
export default React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>(
    (props, ref) => {
        const {
            className = "",
            children,
            size = "",
            widgetTitle,
            widgetIcon,
            isTemplate,
            ...excess
        } = props;

        return (
            <section
                className={cleanClass(
                    `widget ${size} ${isTemplate ? "template" : ""} ${className}`
                )}
                ref={ref}
                {...excess}
            >
                {widgetTitle && widgetIcon && (
                    <h1 className="widget-title">
                        {widgetIcon} {widgetTitle}
                    </h1>
                )}
                {children}
            </section>
        );
    }
);
