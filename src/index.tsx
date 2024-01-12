import ReactDOM from "react-dom/client";
import { Global } from "@emotion/react";

import App from "App";

import GlobalStyle from "./style";
import UpdateManager from "./UpdateManager";


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <>
        <Global styles={GlobalStyle} />
        <App />
        <UpdateManager />
    </>
);
