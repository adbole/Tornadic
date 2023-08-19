import ReactDOM from "react-dom/client";
import { css, Global } from "@emotion/react";

import App from "App";
import Widget from "Components/Widget/style"

import { centerFlex, mediaQueries, vars } from "ts/StyleMixins";

//TODO: switch to themeing
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <>
        <Global
            styles={css`
                * {
                    margin: 0px;
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
                    --background: #2c2c2c;
                    --background-layer: #363636;
                    --border-radius: 15px;
                    --input-border-radius: 10px;
                    --primary: #2668f7;
                    --secondary: #3d3d3d;

                    --svg-size: 1rem;

                    --z-layer-1: 1;
                    --z-layer-2: 2;

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

                    &.hide-overflow {
                        overflow: hidden;
                    }
                }

                svg:not(.recharts-surface) {
                    display: inline-block;
                    width: ${vars.svgSize};
                }

                p,
                h1 {
                    margin: 0px;
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

                    ${mediaQueries.mediumMin} {
                        grid-template-columns: repeat(6, 1fr);
                        grid-template-areas:
                            "n n . . . ."
                            "n n . . . ."
                            "d d . . r r"
                            "d d . . r r";
                    }

                    ${mediaQueries.large} {
                        grid-template-columns: repeat(8, 1fr);
                        grid-template-areas:
                            "n n . . . . . ."
                            "n n . . . . . ."
                            "d d . . r r r r"
                            "d d . . r r r r";
                    }

                    ${mediaQueries.mediumMax} {
                        grid-template-columns: repeat(4, 1fr);
                        grid-template-areas: none;
                    }

                    ${mediaQueries.smallMin} {
                        padding: 10px;
                        gap: 20px;
                    }

                    ${mediaQueries.smallMax} {
                        grid-template-columns: repeat(2, 1fr);

                        ${Widget} + ${Widget} {
                            border-top: 1px solid #ffffff3d;
                        }
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
            `}
        />
        <App />
    </>
);
