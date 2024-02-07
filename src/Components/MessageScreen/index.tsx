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
        "> div": [
            centerFlex,
            {
                position: "fixed",
                flexDirection: "column",
                backdropFilter: "blur(10px)",
                padding: "20px",
                inset: 0,
                [varNames.svgSize]: "50px",
            },
        ],
        [varNames.svgSize]: "500px",
        [mediaQueries.max("small")]: { [varNames.svgSize]: "300px" },
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
