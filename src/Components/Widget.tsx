import React from "react";
import styled from "@emotion/styled";

import { mediaQueries } from "ts/StyleMixins";

// #region Widget
export type WidgetSize = "widget-large" | "widget-wide" | "";

export const WidgetStyle = styled.section<{
    size: WidgetSize;
    isTemplate?: boolean;
}>(({ size, isTemplate }) => [
    {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        padding: "10px",
        overflow: "hidden",

        borderRadius: "var(--border-radius)",
        backdropFilter: "saturate(130%)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",

        ".widget-title": {
            display: "flex",
            flexDirection: "row",
            gap: "5px",

            fontSize: "1rem",
            marginBottom: "10px",
        },
    },
    size === "widget-large" && {
        minHeight: "300px",
        gridColumn: "span 2",
        gridRow: "span 2",
    },
    size === "widget-wide" && { gridColumn: "span 2" },
    !isTemplate && { "> :not(.widget-title)": { flex: 1 } },
]);

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
 * The base of all widgets in the Tornadic application. Everything is a widget and it all starts here.
 * This component will display a simple rectangle box in the root's grid, but can be expanded and customized to fit any need.
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
        <WidgetStyle
            size={size}
            isTemplate={isTemplate}
            ref={ref}
            className={className}
            {...excess}
        >
            {widgetTitle && widgetIcon && (
                <h1 className="widget-title">
                    {widgetIcon} {widgetTitle}
                </h1>
            )}
            {children}
        </WidgetStyle>
    );
});

export default Widget;
