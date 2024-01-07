import { render } from '@testing-library/react';

import GlobalStyle from '../style';


test("Matches screenshot", () => {
    const { container } = render(
        <div css={GlobalStyle}/>
    )

    expect(container).toMatchSnapshot();
})