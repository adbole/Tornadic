import { render } from "@testing-library/react"

import * as svgs from "svgs/widget"


test.each(Object.entries(svgs))("%s", (_, Svg) => {
  const comp = render(<Svg />)

  expect(comp).toMatchSnapshot()
})