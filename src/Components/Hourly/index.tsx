import React from "react";

import { useBooleanState, useDragScroll } from "Hooks";

import { useWeather } from "Contexts/WeatherContext";

import ChartModal from "Components/Modals/Chart";
import { Clock } from "svgs/widget";

import { varNames } from "ts/StyleMixins";
import getTimeFormatted from "ts/TimeConversion";
import type { HourInfo } from "ts/Weather";

import HourlyWidget, { Item, List, Seperator } from "./style";

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

    const dragActive = useDragScroll(listRef);

    return (
        <>
            <HourlyWidget
                widgetTitle="Hourly Forecast"
                widgetIcon={<Clock />}
                onClick={showModal}
                size="widget-wide"
            >
                <List
                    ref={listRef}
                    style={{
                        cursor: dragActive ? "grabbing" : "grab",
                        [varNames.scrollBarColor]: !dragActive && "transparent",
                    }}
                >
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
            </HourlyWidget>
            <ChartModal showView="temperature_2m" isOpen={modalOpen} onClose={hideModal} />
        </>
    );
}
