export const rgbToHex = (red: number, green: number, blue: number): string => `#${_componentToHex(red)}${_componentToHex(green)}${_componentToHex(blue)}`;

function _componentToHex(c: number) {
    const hex = c?.toString(16);

    return hex?.length === 1 ? '0' + hex : hex;
}
