import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, combineLatest, map, zip } from 'rxjs';
import { NamedColor } from '../../../shared/data/named-color.model';
import { sortObs } from '../../../shared/utilities/pipeable-operators';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private apiService: ApiService = inject(ApiService);

  private filterTextSubject = new BehaviorSubject<string>('');
  public filterText$: Observable<string> = this.filterTextSubject.asObservable().pipe(
    map(text => text.trim()),
  );

  // Modify this pipeline to add the group, rValue, gValue, bValue and textColor
  // properties to each NamedColor object in the array

  // Use the pickTextColorBasedOnBgColorAdvanced function to set the textColor.  
  // You can pass 'white' and 'black' as the lightColor and darkColor parameters, respectively.

  colorsWithInfo$: Observable<NamedColor[]> = this.apiService.allNamedColors$.pipe(
    sortObs<NamedColor>('name'),
  )

  // Create and add the subjects/observables that filter the colors by:
  // group, rValue, gValue, bValue, hexValue, fuzzy search for text within name property, regular search for text within name property

  // Use the fuzzy function to do a fuzzy search of the name property.
  filterBy$ = zip(
  )

  filteredColors$: Observable<NamedColor[]> = combineLatest([
    this.colorsWithInfo$,
    this.filterText$,
    //this.filterBy$
  ]).pipe(
    map(([allColors, filterText]: [NamedColor[], string]) => {
      return allColors;
    } )
  )

  changeFilterText(filterText: string) {
    this.filterTextSubject.next(filterText);
  }

}
