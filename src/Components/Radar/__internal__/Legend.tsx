import React from "react";
import styled from "@emotion/styled";

import { useReadLocalStorage } from "Hooks";

import { vars } from "ts/StyleMixins";


const Container = styled.div({
    display: "flex",
    flexDirection: "column",

    width: "100%",
    borderRadius: vars.borderRadius,
    padding: "10px",
});

const Labels = styled.div({
    display: "flex",
    justifyContent: "space-between",
    padding: "0px 5px",

    width: "100%",
    height: "100%",
});

const Range = styled.div({
    width: "100%",
    height: "10px",
    borderRadius: vars.borderRadius,
    margin: "5px 0px",
});

export default function Legend() {
    const { colorScheme, snow } = useReadLocalStorage("radarSettings")!;

    const gradient = React.useMemo(() => {
        switch (colorScheme) {
            case 1: //Original
                return "linear-gradient(to right, #dfdfdf, #dfdfdf, #9bea8f, #58ff42, #47c278, #4793f9, #0c59ff, #6153c1, #ff93a3, #ff3f35, #c20511, #ffeb0a)";
            case 2: //Universal blue
                return "linear-gradient(to right, rgba(206,192,135,0.8), #8de, #09c, #07a, #058, #fe0, #fa0, #f70, #f40, #e00, #900, #faf)";
            case 3: //TITAN
                return "linear-gradient(to right, #007e00, #087fdb, #1c47e8, #6e0dc6, #c80f86, #c06487, #d2883b, #fac431, #fefb02, #fe9a58, #fe5f05, #fd341c)";
            case 4: //The Weather Channel
                return "linear-gradient(to right, #01b714, #01b714, #088915, #11651a, #064307, #ffee07, #f8bb08, #f38b08, #f07108, #ea5e09, #df370a, #d3100c)";
            case 5: //Meteored
                return "linear-gradient(to right, #3ffefcff, #1790f9ff, #0000f3ff, #41ff50ff, #32c23dff, #4b8339ff, #ffff50ff, #fdbb3cff, #df5e0bff, #fd8788ff, #e90000ff, #a80000ff, #ef5beeff, #924cbeff, #502a68ff)";
            case 6: //NEXRAD Level III
                return "linear-gradient(to right, #00efe7, #009cf7, #0000f7, lime, #03b703, #087305, #ff0, #ecce00, #fe9300, red, #bd0000, #bd0000)";
            case 7: //Rainbow @ SELEX-SI"
                return "linear-gradient(to right, #009f9f, #009f9f, #008c4b, #00d319, #21fd22, #fffd1b, #ffd400, #ffab00, #ff6e00, #f01002, #d00523, #e400b1)";
            case 8: //Dark Sky
                return "linear-gradient(to right, rgba(0,94,182,0.133333), rgba(0,94,182,0.2), rgba(0,94,182,0.333333), rgba(0,94,182,0.6), rgba(36,88,175,0.866667), #8e4b9b, #fc5370, #ffb76e, #fffd05, #fffd05, #fffd05, #fffd05)";
            default:
                return "linear-gradient(to right, white, #7f7f7fff)";
        }
    }, [colorScheme]);

    const snowGradient = React.useMemo(() => {
        if (!snow) return undefined;

        return colorScheme === 0
            ? "linear-gradient(to right, #808080ff, #ffffffff)"
            : "linear-gradient(to right, #9fffff, #5fcfff, #005fff)";
    }, [colorScheme, snow]);

    return (
        <Container className="leaflet-custom-control">
            <Labels>
                <span>Low</span>
                <span>High</span>
            </Labels>
            <Range style={{ background: gradient }} data-teststyle-background={gradient} />
            {snowGradient && (
                <Range
                    style={{ background: snowGradient }}
                    data-teststyle-background={snowGradient}
                />
            )}
        </Container>
    );
}
