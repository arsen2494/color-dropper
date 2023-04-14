import React, { CanvasHTMLAttributes, memo, MouseEvent } from "react";
import { CanvasData, useCanvas } from "../../hooks/useCanvas";

interface CanvasProps {
    draw?: () => void;
    imageSrc: string;
    handleMouseMove?: (e: MouseEvent) => void;
    handleClick?: (e: MouseEvent) => void;
    onContentLoad?: (data: CanvasData) => void;
}

const Canvas: React.FC<CanvasProps & CanvasHTMLAttributes<HTMLCanvasElement>> = ({draw, imageSrc, handleMouseMove, onContentLoad, handleClick, ...rest}) => {
    const canvasRef = useCanvas(draw, imageSrc, onContentLoad);

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={e => handleMouseMove && handleMouseMove(e)}
            onClick={e => handleClick && handleClick(e)}
            {...rest}
        />
    );
};

export default memo(Canvas);
