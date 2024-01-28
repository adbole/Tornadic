import styled from "@emotion/styled";


export default styled.div({
    display: "flex",
    overflow: "hidden",

    "> div": { flex: "0 0 100%" },
});

export const SlideContent = styled.div({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",

    zIndex: 3,
});
