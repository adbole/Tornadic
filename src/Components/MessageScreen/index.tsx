import styled from "@emotion/styled";

import { Tornadic } from "svgs/icon";

import { centerFlex, mediaQueries } from "ts/StyleMixins";


const Container = styled.div([
    centerFlex,
    {
        flexDirection: "column",
        position: "fixed",
        inset: 0,

        textAlign: "center",
        "> svg": { width: "500px" },
        "> div": [
            centerFlex,
            {
                position: "fixed",
                flexDirection: "column",
                backdropFilter: "blur(10px)",
                inset: 0,
                "> svg": { width: "50px" },
            },
        ],
        [mediaQueries.small]: { "> svg": { width: "300px" } },
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
