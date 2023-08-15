import styled from "@emotion/styled";

import { center_flex } from "ts/StyleMixins";

import type { WidgetProps } from "./Widget";
import Widget from "./Widget";


const Container = styled.div({
    position: "relative",

    svg: {
        position: "absolute",
        transform: "translateX(-50%)",
        left: "50%",
        height: "100%",
        width: "100%",
    },
});

const ChildContainer = styled.div([
    center_flex,
    {
        flexDirection: "column",
        width: "100%",
        height: "100%",

        p: {
            maxWidth: "60%",
            textAlign: "center",
        },
        "p:first-of-type": { fontSize: "2rem" },
    },
]);

export default function GaugeWidget({
    children,
    gague,
    ...widgetProps
}: WidgetProps & {
    gague: React.ReactNode;
}) {
    return (
        <Widget {...widgetProps}>
            <Container>
                {gague}
                <ChildContainer>{children}</ChildContainer>
            </Container>
        </Widget>
    );
}
