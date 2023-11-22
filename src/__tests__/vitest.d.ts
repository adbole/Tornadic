// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'


interface CustomMatchers<R = unknown> {
    toHaveLocalItemValue: <K extends keyof StorageKeysAndTypes>(key: K, value: StorageKeysAndTypes[K]) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}