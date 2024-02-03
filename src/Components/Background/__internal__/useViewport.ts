import { useThree } from "@react-three/fiber";


export default function useViewport() {
    const camera = useThree(state => state.camera);
    const { getCurrentViewport } = useThree(state => state.viewport)

    const { width, height } = getCurrentViewport(camera, [14.95, 0, -50])

    return { width, height }
}