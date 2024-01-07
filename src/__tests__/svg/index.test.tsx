import { render } from "@testing-library/react";

import * as svgs from "svgs";


test.each(Object.entries(svgs))("%s", (_, Svg) => {
    const { container } = render(<Svg />);

    expect(container).toMatchSnapshot();
});
