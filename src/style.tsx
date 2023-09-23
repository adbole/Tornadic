import { css } from "@emotion/react";

import { centerFlex, mediaQueries, varNames, vars } from "ts/StyleMixins";


export default css`
    * {
        margin: 0;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            "Open Sans",
            "Helvetica Neue",
            sans-serif !important;
        font-weight: 400;
        box-sizing: border-box !important;
        overflow-wrap: break-word;
    }

    :root {
        ${varNames.background}: #2c2c2c;
        ${varNames.backgroundLayer}: #363636;
        ${varNames.primary}: #2668f7;
        ${varNames.watch}: #FFF501;
        ${varNames.advise}: #FF9431;
        ${varNames.warn}: #C31700;
        ${varNames.statement}: #8F00FF;

        ${varNames.borderRadius}: 15px;
        ${varNames.inputBorderRadius}: 10px;

        ${varNames.svgSize}: 1rem;

        ${varNames.zLayer1}: 1;
        ${varNames.zLayer2}: 2;

        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
    }

    *::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }
    *::-webkit-scrollbar-track {
        background: transparent;
    }
    *::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 5px;
    }

    body {
        ${centerFlex}
        min-height: 100vh;

        background: radial-gradient(111% 111% at 74.29% -11%, #a93300 0%, #083434 100%),
            linear-gradient(127.43deg, #00d5c8 0%, #2200aa 100%);
        background-blend-mode: difference, normal;
    }

    svg:not(.recharts-surface) {
        display: inline-block;
        width: ${vars.svgSize};
    }

    p,
    h1 {
        margin: 0;
        line-height: 1;
        height: fit-content;

        //If an svg is within a p or h1, this will ensure it aligns somewhat properly
        > svg {
            vertical-align: middle;
        }
    }

    #root {
        display: grid;
        grid-auto-rows: 150px;
        grid-auto-flow: dense;

        width: 100%;
        max-width: 1800px;

        ${mediaQueries.min("medium")} {
            grid-template-columns: repeat(6, 1fr);
            grid-template-areas:
                "n n . . . ."
                "n n . . . ."
                "d d . . r r"
                "d d . . r r";
        }

        ${mediaQueries.min("large")} {
            grid-template-columns: repeat(8, 1fr);
            grid-template-areas:
                "n n . . . . . ."
                "n n . . . . . ."
                "d d . . r r r r"
                "d d . . r r r r";
        }

        ${mediaQueries.max("medium")} {
            grid-template-columns: repeat(4, 1fr);
            grid-template-areas: none;
        }

        padding: 10px;
        gap: 20px;

        ${mediaQueries.max("small")} {
            gap: 10px;
            grid-template-columns: repeat(2, 1fr);
        }
    }

    #toast-root {
        position: fixed;
        z-index: ${vars.zLayer2};
        display: flex;
        flex-direction: column;
        bottom: 0px;
        height: fit-content;
        max-width: 100vw;
        padding: 10px;
        gap: 10px;
    }
`;
