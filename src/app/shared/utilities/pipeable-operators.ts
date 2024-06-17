import { Observable, concatMap, filter, from, map, toArray, withLatestFrom } from "rxjs";

import { compareValues } from "./basic-util";
import { getColorGroup, hexToRGB, pickTextColorBasedOnBgColorAdvanced } from "./color-util";
import { ColorGroup } from "../data/color-group.data";

export function addGroup() {
  return function<T extends { hexValue: string }>(source: Observable<T>): Observable<T> {
    return source.pipe(
      map((color: T) => {
          const rgb: number[] = hexToRGB(color.hexValue);
          const group: string = getColorGroup(rgb[0], rgb[1], rgb[2]);
    
          return {
            ...color,
            group
          }
      })
    );
  }
}

export function addTextColor() {
  return function<T extends { hexValue: string }>(source: Observable<T>): Observable<T> {
    return source.pipe(
      map((color: T) => {
          const contrastTextColor = pickTextColorBasedOnBgColorAdvanced(color.hexValue, '#FFFFFF', '#000000');
    
          return {
            ...color,
            textColor: contrastTextColor
          }
      })
    );
  }
}

export function addRGBValues() {
  return function<T extends { hexValue: string }>(source: Observable<T>): Observable<T> {
    return source.pipe(
      map((color: T) => {
          const [rValue, gValue, bValue] = hexToRGB(color.hexValue);
    
          return {
            ...color,
            rValue,
            gValue,
            bValue
          }
      })
    );
  }
}

// sort observable result by given object property
// the source observable must emit an array
export function sortObs<T>(key: keyof T, order: 'asc' | 'desc' = 'asc') {
  return function(source: Observable<T[]>): Observable<T[]> {
    return source.pipe(
      map((arrayOfObjects: T[]) => arrayOfObjects.sort(compareValues(key, order)))
    );
  }
}

export function filterByGroups<T extends { hexValue: string }>(...group: ColorGroup[]) {
  return function(source: Observable<T[]>): Observable<T[]> {
    return source.pipe(
      concatMap((colors: T[]) => from(colors)),
      filter((color: T) => {
        const rgb: number[] = hexToRGB(color.hexValue);
        const currGroup: ColorGroup = getColorGroup(rgb[0], rgb[1], rgb[2]);
        return group.includes(currGroup);
      }),
      toArray()
    );
  }
}

export function filterColorsWithDifferentClosests() {
  return function(source: Observable<any[]>): Observable<any[]> {
    return source.pipe(
      concatMap((colors: any[]) => from(colors)),
      filter((color: any) => {
        const colorHex: string = (color.hexValue.charAt(0) === '#') ? color.hexValue.substring(1, 7).toLocaleUpperCase() : color.hexValue.toLocaleUpperCase();
        
        if (!!color.closestColors) {
          const firstClosestHex: string = (color.closestColors[0].hexValue.charAt(0) === '#') ? color.closestColors[0].hexValue.substring(1, 7).toLocaleUpperCase() : color.closestColors[0].hexValue.toLocaleUpperCase();

          return (colorHex !== firstClosestHex) &&
                  (color.closestColors.length > 1) &&
                  !color.closestColors.every((closest: any) => {
                    const closestHex: string = (closest.hexValue.charAt(0) === '#') ? closest.hexValue.substring(1, 7).toLocaleUpperCase() : closest.hexValue.toLocaleUpperCase();
                    return closestHex === firstClosestHex;
                  });
        }
  
        return false;
      }),
      toArray()
    )
  }
}