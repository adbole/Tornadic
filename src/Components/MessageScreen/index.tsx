import styled from "@emotion/styled";

import { Tornadic } from "svgs/icon";

import { centerFlex, mediaQueries, varNames } from "ts/StyleMixins";


const Container = styled.div([
    centerFlex,
    {
        flexDirection: "column",
        position: "fixed",
        inset: 0,

        textAlign: "center",
        [varNames.svgSize]: "500px",
        "> div": [
            centerFlex,
            {
                position: "fixed",
                flexDirection: "column",
                backdropFilter: "blur(10px)",
                inset: 0,
                [varNames.svgSize]: "50px",
            },
        ],
        [mediaQueries.smallMax]: { [varNames.svgSize]: "300px" },
    },
]);

export default function MessageScreen({ children }: { children: React.ReactNode }) {
    return (
        <Container>
            <Tornadic />
            <div>{children}</div>
        </Container>
    );
}
