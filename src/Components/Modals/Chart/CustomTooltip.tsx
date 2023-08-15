import styled from "@emotion/styled";
import type { TooltipProps } from "recharts";
import type { NameType } from "recharts/types/component/DefaultTooltipContent";

import { get_aq, get_uv } from "ts/Helpers";
import { center_flex, darkBackBlur } from "ts/StyleMixins";

import type { ChartViews, DataPoint } from ".";


const Container = styled.div(center_flex, darkBackBlur, {
    borderRadius: "var(--border-radius)",
    flexDirection: "column",
    padding: "10px",
    h1: { padding: 0 },
});

function getUnit(data: DataPoint, defaultUnit: React.ReactNode) {
    const { property, primaryKey } = data;

    if (property === "uv_index") {
        return " " + get_uv(primaryKey);
    } else if (property === "us_aqi") {
        return " " + get_aq(primaryKey);
    }

    return defaultUnit;
}

//Customized tooltip to display primary and secondary data with labels if applicable
export default function CustomTooltip({ active, payload }: TooltipProps<number, NameType>) {
    if (!active || !payload || !payload.length) return null;

    const fixDecimal = (property: ChartViews, value: number): string | number =>
        property === "precipitation" || property === "surface_pressure"
            ? value.toFixed(2)
            : value.toFixed(0);

    const data: DataPoint = payload[0].payload;
    const unit = getUnit(data, payload[0].unit);
    const label =
        (data.property === "temperature_2m" && "Feels: ") ||
        (data.property === "windspeed_10m" && "Gust: ");

    return (
        <Container>
            <h1>
                {fixDecimal(data.property, data.primaryKey)}
                {unit}
            </h1>
            {data.secondaryKey && (
                <p>
                    {label}
                    {fixDecimal(data.property, data.secondaryKey)}
                    {unit}
                </p>
            )}
        </Container>
    );
}
