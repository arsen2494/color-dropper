import { useEffect, useMemo, useRef } from "react";

export interface CanvasData {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
}

export const useCanvas = (draw?: () => void, imageSrc?: string, onContentLoad?: (data: CanvasData) => void) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const image = useMemo(() => new Image(), []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        if (imageSrc) {
            image.src = imageSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
            };
        }

        onContentLoad({ image, ctx });
        draw && draw();
    }, [draw, imageSrc, image, onContentLoad]);

    return canvasRef;
};
