import styled from "@emotion/styled";

import { Tornadic } from "svgs/icon";

import { centerFlex, inset, mediaQueries } from "ts/StyleMixins";


const Container = styled.div([
    inset("0px"),
    centerFlex,
    {
        flexDirection: "column",
        position: "fixed",

        textAlign: "center",
        "> svg": { width: "500px" },
        "> div": [
            inset("0px"),
            centerFlex,
            {
                position: "fixed",
                flexDirection: "column",
                backdropFilter: "blur(10px)",
                "> svg": { width: "50px" },
            },
        ],
        [mediaQueries.small]: { "> svg": { width: "300px" } }
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
