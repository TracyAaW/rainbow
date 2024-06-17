import { ColorGroup } from "../data/color-group.data";

export const rgbToHsl = (rVal: number, gVal: number, bVal: number) => {
  const r = rVal / 255;
  const g = gVal / 255;
  const b = bVal / 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
}

export const isPixelGray = (rVal: number, gVal: number, bVal: number) =>  {
  const pixel = [rVal, gVal, bVal];
  if ( Math.max(...pixel) - Math.min(...pixel) < 3 ) {
    return true;
  }
  return false;
}

// http://www.workwithcolor.com/red-color-hue-range-01.htm
export const getColorGroup = (rVal: number, gVal: number, bVal: number): ColorGroup => {
  let [ hue, sat, light ] = rgbToHsl(rVal, gVal, bVal);

  if ( light < 3 || sat < 50  && light < 5 ) {
    return ColorGroup.Black;
  }

  if ( light > 96 ) {
    return ColorGroup.White;
  }

  if (hue === 0 && isPixelGray(rVal, gVal, bVal) ) {
    return ColorGroup.Gray;
  }

  if (hue > 355 || hue <= 11) return ColorGroup.Red;

  if (hue > 11 && hue <= 21) return ColorGroup.RedOrange;

  if (hue > 21 && hue <= 41) return ColorGroup.OrangeBrown;

  if (hue > 41 && hue <= 51) return ColorGroup.OrangeYellow;

  if (hue > 51 && hue <= 61) return ColorGroup.Yellow;

  if (hue > 61 && hue <= 81) return ColorGroup.YellowGreen;

  if (hue > 81 && hue <= 141) return ColorGroup.Green;

  if (hue > 141 && hue <= 170) return ColorGroup.GreenCyan;

  if (hue > 170 && hue <= 201) return ColorGroup.Cyan;

  if (hue > 201 && hue <= 221) return ColorGroup.CyanBlue;

  if (hue > 221 && hue <= 241) return ColorGroup.Blue;

  if (hue > 241 && hue <= 281) return ColorGroup.BlueMagenta;

  if (hue > 281 && hue <= 321) return ColorGroup.Magenta;

  if (hue > 321 && hue <= 331) return ColorGroup.MagentaPink;

  if (hue > 331 && hue <= 346) return ColorGroup.Pink;

  if (hue > 346 && hue <= 355) return ColorGroup.PinkRed;

  return ColorGroup.Undefined;
}

export const pickTextColorBasedOnBgColorAdvanced = (bgColor: string, lightColor: string, darkColor: string) => {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.179) ? darkColor : lightColor;
}

export function getContrastTextColor(hex: string, bw: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
  }
  let r: any = parseInt(hex.slice(0, 2), 16),
      g: any = parseInt(hex.slice(2, 4), 16),
      b: any = parseInt(hex.slice(4, 6), 16);
  if (bw) {
      // https://stackoverflow.com/a/3943023/112731
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186
          ? '#000000'
          : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: string, len = 2) {
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export const hexToRGB = (hex: string) => {
  // Remove the # character from the beginning of the hex code
  hex = hex.replace("#", "");
  
  // Convert the red, green, and blue components from hex to decimal
  // you can substring instead of slice as well
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Return the RGB value as an object with properties r, g, and b
  return [r, g, b];
}

export const isHex = (hexValue: string) => /^#[0-9A-F]{6}$/i.test(hexValue);


export function getColorDistance(targetColor: { hexValue: string}, testColor: { hexValue: string}): number {
  const [r1, g1, b1] = hexToRGB(targetColor.hexValue);
  const [r2, g2, b2] = hexToRGB(testColor.hexValue);
  
  return Math.sqrt(
    (r1 - r2) ** 2 +
    (g1 - g2) ** 2 +
    (b1 - b2) ** 2
  );

}

export function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getRFromHex(hex: string) {
  const hexRaw = hex.replace('#', '');
  const hexValue = hexRaw.length === 3 ? `${hexRaw[0]}${hexRaw[0]}${hexRaw[1]}${hexRaw[1]}${hexRaw[2]}${hexRaw[2]}` : hexRaw;
  return parseInt(hexValue.substring(0, 2), 16);
}

export function getGFromHex(hex: string) {
  const hexRaw = hex.replace('#', '');
  const hexValue = hexRaw.length === 3 ? `${hexRaw[0]}${hexRaw[0]}${hexRaw[1]}${hexRaw[1]}${hexRaw[2]}${hexRaw[2]}` : hexRaw;
  return parseInt(hexValue.substring(2, 4), 16);
}

export function getBFromHex(hex: string) {
  const hexRaw = hex.replace('#', '');
  const hexValue = hexRaw.length === 3 ? `${hexRaw[0]}${hexRaw[0]}${hexRaw[1]}${hexRaw[1]}${hexRaw[2]}${hexRaw[2]}` : hexRaw;
  return parseInt(hexValue.substring(4), 16);
}

export const isValidHexValue = (testValue: string) => {
  return /^([A-Fa-f0-9]{6})$/i.test(testValue.replace('#', ''));
}

export const isValidR = (testValue: string) => {
  return /^[r]\d{1,3}/i.test(testValue);
}

export const isValidG = (testValue: string) => {
  return /^[g]\d{1,3}/i.test(testValue);
}

export const isValidB = (testValue: string) => {
  return /^[b]\d{1,3}/i.test(testValue);
}
