import React from "react";
import ReactDOM from "react-dom/client";

import SettingsContext from "Contexts/SettingsContext";

import App from "App";


const Index = () => (
    <SettingsContext>
        <App/>
    </SettingsContext>
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Index />);
