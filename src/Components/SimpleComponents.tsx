/**
 * A collection of simple components that aren't complex enough for their own files
 */

import React from 'react';
import { TornadicLoader } from '../svgs/svgs';

// #region Widget
export enum WidgetSize {
    NORMAL = "",
    LARGE = " widget-large",
    WIDE = " widget-wide"
}

/**
 * The base of all widgets in the Tornadic application. Everything is a widget and it all starts here.
 * This component will display a simple rectangle box in the root's grid, but can be expanded and customized to fit any need. 
 */
export const Widget = React.forwardRef<HTMLDivElement, WidgetProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const {className, children, size, widgetTitle, widgetIcon, ...excess} = props;

    let classList = "widget" + size;
    if(className) classList += " " + className;

    return (
        <div className={classList} ref={ref} {...excess}>
            {widgetTitle && widgetIcon && 
                <div className="widget-title">
                    <p>{widgetIcon} {widgetTitle} </p>
                </div>
            }
            
            {children}
    </div>
    );
});

type WidgetProps = {
    size?: WidgetSize,
    children: React.ReactNode,
    widgetTitle?: string,
    widgetIcon?: React.ReactNode
}

Widget.defaultProps = {
    size: WidgetSize.NORMAL
};
// #endregion Widget

// #region BasicInfoView
export const SimpleInfoWidget = (props: {
    icon: React.ReactNode,
    title: string,
    value: string,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}) => (
    <Widget className="basic-info" onClick={props.onClick}>
        {props.icon}
        <p>{props.title}</p>
        <h1>{props.value}</h1>
    </Widget>
);
// #endregion BasicInfoView

export const Loader = () => (
    <>
        <div id="loader">
            <TornadicLoader/>
        </div>
    </>
);