import React from "react";
import styled from "@emotion/styled";

import { useBooleanState, useDragScroll } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import Chart from "Components/Modals/Chart";
import Widget from "Components/Widget";
import { Clock } from "svgs/widget";

import getTimeFormatted from "ts/TimeConversion";
import type { HourInfo } from "ts/Weather";


const List = styled.ol({
    display: "flex",
    listStyleType: "none",
    padding: "0px",
    overflowY: "hidden",

    gap: "20px",
    cursor: "grab",

    "&.drag-active": { cursor: "grabbing" },
    "&:not(.drag-active)::-webkit-scrollbar-thumb": { backgroundColor: "transparent !important" },
});

const Item = styled.li({
    display: "flex",
    flexDirection: "column",
    gap: "5px",

    p: { whiteSpace: "nowrap" },
    "> div": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        flex: "1",

        svg: { width: "2rem" },
    },
});

const Seperator = styled.li({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    "&::before, &::after": {
        content: '""',
        display: "inline-block",
        flex: "1 1 auto",
        width: "5px",
        backgroundColor: "white",
        borderRadius: "5px",
    },
});

/**
 * A helper component for the Hourly component to display the individual hours
 */
function Hour({ hourInfo }: { hourInfo: HourInfo }) {
    return (
        <Item>
            <p>{getTimeFormatted(hourInfo.time, "hour")}</p>
            <div>
                <hourInfo.conditionInfo.icon />
                {hourInfo.has_chance_of_rain && <span>{hourInfo.precipitation_probability}%</span>}
            </div>
            <p>{hourInfo.temperature}°</p>
        </Item>
    );
}

/**
 * A helper component for the Hourly component to display a seperator to indicate when a new day starts.
 */
function DaySeperator({ day }: { day: string }) {
    return (
        <Seperator className="seperator">
            <p>{day}</p>
        </Seperator>
    );
}

/**
 * Displays the next 48hrs of weather data in a horizontally-scrollable list
 * @returns The Hourly widget
 */
export default function Hourly() {
    const { weather } = useWeather();
    const [modalOpen, showModal, hideModal] = useBooleanState(false);
    const listRef = React.useRef<HTMLOListElement | null>(null);

    useDragScroll(listRef);

    return (
        <>
            <Widget
                widgetTitle="Hourly Forecast"
                widgetIcon={<Clock />}
                onClick={showModal}
                size="widget-wide"
            >
                <List ref={listRef} className="flex-list drag-scroll">
                    {[...weather.getFutureValues()].map((forecast, index) => {
                        const time = new Date(forecast.time);

                        //To indicate a new day, add a day seperator
                        if (time.getHours() === 0) {
                            return (
                                <React.Fragment key={index}>
                                    <DaySeperator day={getTimeFormatted(time, "weekday")} />
                                    <Hour hourInfo={forecast} />
                                </React.Fragment>
                            );
                        }
                        return <Hour key={index} hourInfo={forecast} />;
                    })}
                </List>
            </Widget>
            <Chart showView="temperature_2m" isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
