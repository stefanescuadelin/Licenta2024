import { useEffect, useState } from "react";

export const useSizes = ({
    elemId,
    onResize
}: {
    onResize?: boolean;
    elemId: string
}, deps: any[] = []) => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const fn = () => {
        const element = document.getElementById(elemId);
        if (element) {
            const height = element.clientHeight
            const width = element.clientWidth
            setWidth(width)
            setHeight(height)
        }
    }


    useEffect(() => {
        if (onResize)
            window.addEventListener("resize", fn)
        return () => {
            window.removeEventListener("resize", fn);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        fn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ elemId, ...deps]);
    return { height, width }
}