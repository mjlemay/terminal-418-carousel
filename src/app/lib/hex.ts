export const isValidHex = (hex:string):boolean => {
    const reg = /^[0-9A-F]{6}[0-9a-f]{0,2}$/i;
    return reg.test(hex);
}

export const hexToDecimal = (hex:string):number => {
    return parseInt(hex, 16);
}