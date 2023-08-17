import { css,keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import Widget from "Components/Widget";


const shine = keyframes({ to: { backgroundPositionX: "-200%" } });

export const Base = css({
    background: "linear-gradient(135deg, transparent 40%, #f5f5f51a 50%, transparent 60%)",
    backgroundSize: "200%, 100%",
    animation: `${shine} 1.5s linear infinite`,
});

export default styled(Widget)(Base);