import type { DataPoint } from "../.."


export type YProp = keyof Pick<DataPoint, "y1" | "y2">
