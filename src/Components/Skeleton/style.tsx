import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";


const shine = keyframes({ to: { backgroundPositionX: "-200%" } });

export const Base = css({
    // background: "linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0.15) 60%, transparent 70%)",
    background:
        "linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0))",
    backgroundSize: "200%, 100%",
    animation: `${shine} 1.5s linear infinite`,
});

export default styled(Widget)(Base);
