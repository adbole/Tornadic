export default function matchBrokenText(text: string) {
    return (_: unknown, element: Element | null) => {
        const hasText = element!.textContent!.includes(text)
        const childrenDontHaveText = ![...element!.children].some(child => child.textContent!.includes(text))

        return hasText && childrenDontHaveText
    }
}