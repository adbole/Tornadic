import { render } from "@testing-library/react";

import Input from "./Input";


test("Matches snapshot", () => {
    const { container } = render(<Input />);

    expect(container).toMatchSnapshot();
});
