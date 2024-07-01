import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, combineLatest, concatMap, from, map, toArray, zip } from 'rxjs';
import { NamedColor } from '../../../shared/data/named-color.model';
import { addGroup, addRGBValues, addTextColor, sortObs } from '../../../shared/utilities/pipeable-operators';
import { isValidB, isValidG, isValidHexValue, isValidR } from '../../../shared/utilities/color-util';
import { fuzzy } from '../../../shared/utilities/basic-util';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private apiService: ApiService = inject(ApiService);

  private filterTextSubject = new BehaviorSubject<string>('');
  public filterText$: Observable<string> = this.filterTextSubject.asObservable().pipe(
    map(text => text.trim()),
  );
  
  returnAllColors$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => filterText === ''),
  )

  filterByHex$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => isValidHexValue(filterText)),
  )

  filterByRValue$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => isValidR(filterText))
  )

  filterByGValue$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => isValidG(filterText))
  )

  filterByBValue$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => isValidB(filterText))
  )

  filterByGroup$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => filterText.toLocaleLowerCase().includes('group:'))
  )

  filterByFuzzy$: Observable<boolean> = this.filterText$.pipe(
    map((filterText: string) => filterText.startsWith('~'))
  )

  // Modify this pipeline to add the group, rValue, gValue, bValue and textColor
  // properties to each NamedColor object in the array

  // Use the pickTextColorBasedOnBgColorAdvanced function to set the textColor.  
  // You can pass 'white' and 'black' as the lightColor and darkColor parameters, respectively.

  colorsWithInfo$: Observable<NamedColor[]> = this.apiService.allNamedColors$.pipe(
    concatMap((allColors: NamedColor[]) => from(allColors)),
    addGroup(),
    addRGBValues(),
    addTextColor(),
    toArray(),
    sortObs<NamedColor>('name'),
  )

  // Create and add the subjects/observables that filter the colors by:
  // group, rValue, gValue, bValue, hexValue, fuzzy search for text within name property, regular search for text within name property

  // Use the fuzzy function to do a fuzzy search of the name property.
  filterBy$ = zip(
    this.returnAllColors$,
    this.filterByHex$,
    this.filterByRValue$,
    this.filterByGValue$,
    this.filterByBValue$,
    this.filterByGroup$,
    this.filterByFuzzy$
  )

  filteredColors$: Observable<NamedColor[]> = combineLatest([
    this.colorsWithInfo$,
    this.filterText$,
    this.filterBy$
  ]).pipe(
    map(([allColors, filterText, [returnAll, byHex, byR, byG, byB, byGroup, byFuzzy]]: [NamedColor[], string, [boolean, boolean, boolean, boolean, boolean, boolean, boolean]]) => {
      if (returnAll) {
        return allColors;
      }

      if (byHex) {
        return allColors.filter((color: NamedColor) => color.hexValue.toLocaleLowerCase() === filterText.toLocaleLowerCase());
      }

      if (byR) {
        return allColors.filter((color: NamedColor) => color.rValue === +filterText.toLocaleLowerCase().replace('r', ''));
      }

      if (byG) {
        return allColors.filter((color: NamedColor) => color.gValue === +filterText.toLocaleLowerCase().replace('g', ''));
      }

      if (byB) {
        return allColors.filter((color: NamedColor) => color.bValue === +filterText.toLocaleLowerCase().replace('b', ''));
      }

      if (byGroup) {
        return allColors.filter((color: NamedColor) => color.group?.toLocaleLowerCase() === filterText.toLocaleLowerCase().replace('group:', '').trim());
      }

      if (byFuzzy) {
        return allColors.filter((color: NamedColor) => fuzzy(color.name.toLocaleLowerCase() ,filterText.toLocaleLowerCase().replace('~', '')));
      }

      return allColors.filter((color: NamedColor) => color.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()));
    } )
  )

  changeFilterText(filterText: string) {
    this.filterTextSubject.next(filterText);
  }

}
