import React, { useCallback, MouseEvent, useState } from 'react';
import Canvas from "./components/Canvas/Canvas";
import imageSrc from './assets/images/image.jpg';
import css from './ColorDropperApp.module.css';
import { ReactComponent as DropperIcon } from './assets/icons/icon-color-picker.svg';
import classNames from "classnames";
import { CanvasData } from "./hooks/useCanvas";
import { rgbToHex } from "./utils";
import constants from "./constants";

function ColorDropperApp() {
    const [isDropperActive, setIsDropperActive] = useState<boolean>(false);
    const [color, setColor] = useState<string>('');
    const [data, setData] = useState<CanvasData>(null);

    const ctx = data?.ctx;
    const image = data?.image;
    const imageData = ctx?.getImageData(0, 0, ctx?.canvas.width, ctx?.canvas.height);

    const getPixelColor = useCallback((x: number, y: number) => {
        const { data } = imageData;
        const pixel = ctx?.canvas.width * x + y;
        const arrayPos = pixel * 4;

        return {
            red: data[arrayPos],
            green: data[arrayPos + 1],
            blue: data[arrayPos + 2],
            alpha: data[arrayPos + 3],
        };
    }, [ctx?.canvas.width, imageData]);

    const resetCanvas = useCallback(() => {
        const canvas = ctx?.canvas;

        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    }, [ctx, image]);

    const zoom = useCallback((x: number, y: number) => {
        const inset = constants.zoomWidth / 2 + 1;

        ctx.drawImage(
            ctx.canvas,
            x - constants.zoom / 2,
            y - constants.zoom / 2,
            constants.zoom,
            constants.zoom,
            x - inset,
            y - inset,
            constants.zoomWidth,
            constants.zoomHeight
        );
    }, [ctx]);

    const drawColor = useCallback((x: number, y: number) => {
        const { red, green, blue } = getPixelColor(y, x);
        const hexColor = rgbToHex(red, green, blue);

        ctx.fillStyle = '#fff';
        ctx.fillRect(x - (constants.hexWidth / 2 + 1), y + 12, constants.hexWidth, constants.hexHeight);
        ctx.restore();
        ctx.fillStyle = '#000';
        ctx.fillText(hexColor, x - 18, y + 24);
    }, [ctx, getPixelColor]);

    const drawCircle = useCallback((x: number, y: number) => {
        const { red, green, blue } = getPixelColor(y, x);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, constants.zoomCircleRadius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.lineWidth = constants.zoomCircleLineWidth;
        ctx.stroke();
        ctx.clip();
    }, [ctx, getPixelColor]);

    const drawPixel = useCallback((x: number, y: number) => {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 3, y - 3, 6, 6);
    }, [ctx]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;

        resetCanvas();
        drawCircle(offsetX, offsetY);
        zoom(offsetX, offsetY);
        drawPixel(offsetX, offsetY);
        drawColor(offsetX, offsetY);

        ctx.restore();

    }, [resetCanvas, zoom, drawCircle, ctx, drawColor, drawPixel]);

    const handleClick = useCallback((e: MouseEvent) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const { red, green, blue } = getPixelColor(offsetY, offsetX);

        setColor(rgbToHex(red, green, blue));
    }, [getPixelColor]);

    const handleDropperClick = () => {
        setIsDropperActive(prevState => {
            if (prevState) {
                resetCanvas();
            }

            return !prevState;
        });
    };

    return (
        <div className={css.container}>
            <header className={css.header}>
                <div className={classNames(css.dropperIcon, isDropperActive && css.active)}>
                    <DropperIcon onClick={handleDropperClick} />
                </div>
                <span>{color}</span>
            </header>
            <main className={classNames(css.wrapper, isDropperActive && css.dropperActive)}>
                <Canvas
                    imageSrc={imageSrc}
                    width={1280}
                    height={720}
                    handleMouseMove={isDropperActive && handleMouseMove}
                    onContentLoad={setData}
                    handleClick={isDropperActive && handleClick}
                />
            </main>
        </div>
    );
}

export default ColorDropperApp;
