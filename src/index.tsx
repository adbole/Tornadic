import ReactDOM from "react-dom/client";
import { css, Global } from "@emotion/react"

import App from "App";

import { center_flex } from "ts/StyleMixins";

//TODO: switch to themeing
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <>
        <Global 
            styles={
                css`
                    * {
                        margin: 0px;
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
                        font-weight: 400;
                        box-sizing: border-box !important;
                        overflow-wrap: break-word;
                    }

                    :root {
                        --widget-back: #2c2c2c;
                        --widget-back-layer: #363636;
                        --border-radius: 15px;
                        --input-border-radius: 10px;
                        --primary: #2668f7;
                        --secondary: #3d3d3d;
                    
                        --on-top: 99999;

                        color:rgba(255, 255, 255, 0.9);
                        font-size: 16px;
                    }

                    *::-webkit-scrollbar { 
                        width: 5px;
                        height: 5px; 
                    }
                    *::-webkit-scrollbar-track { background: transparent; }
                    *::-webkit-scrollbar-thumb { 
                        background: rgba(255, 255, 255, 0.25);
                        border-radius: 5px; 
                    }

                    body {
                        ${center_flex}
                        min-height: 100vh;
                        
                        background: radial-gradient(111% 111% at 74.29% -11%, #A93300 0%, #083434 100%), linear-gradient(127.43deg, #00D5C8 0%, #2200AA 100%);
                        background-blend-mode: difference, normal;

                        &.hide-overflow {
                            overflow: hidden;
                        }
                    }

                    svg {  
                        display: inline-block;
                        width: 1rem; 
                    }

                    p, h1 {
                        margin: 0px;
                        line-height: 1;
                        height: fit-content;

                        //If an svg is within a p or h1, this will ensure it aligns somewhat properly
                        >svg {
                            vertical-align: middle;
                        }
                    }

                    #root {
                        display: grid;
                        grid-auto-rows: 150px;
                        grid-auto-flow: dense;
                        gap: 20px;

                        padding: 10px;

                        width: 100%;
                        max-width: 1800px;
                    }
                `
            }
        />
        <App />
    </>
);
