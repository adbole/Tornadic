import styled from "@emotion/styled";

import { Tornadic } from "svgs/icon";

import { center_flex, inset } from "ts/StyleMixins";


const Container = styled.div([
    inset("0px"),
    center_flex,
    {
        flexDirection: "column",
        position: "fixed",

        textAlign: "center",
        "> svg": { width: "500px" },
        "> div": [
            inset("0px"),
            center_flex,
            {
                position: "fixed",
                flexDirection: "column",
                backdropFilter: "blur(10px)",
                "> svg": { width: "50px" },
            },
        ],
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
