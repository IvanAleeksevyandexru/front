import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ListElement } from '@epgu/epgu-lib';
import {
  ComponentAttrsDto,
  DictionaryConditions,
  DictionaryValueTypes,
} from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { TimeSlotDoctorsComponent, TimeSlotDoctorState } from '../time-slot-doctors.interface';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { CustomComponent } from '../../../../custom-screen/components-list.types';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'epgu-constructor-time-slot-doctors-container',
  templateUrl: './time-slot-doctors-container.component.html',
})
export class TimeSlotDoctorsContainerComponent implements OnInit {
  state$$ = new BehaviorSubject<TimeSlotDoctorState>({
    specLookup: null,
    docLookup: null,
  });

  public specProvider;
  public doctorProvider;

  public specLookupControl = new FormControl();
  public docLookupControl = new FormControl();


  timeSlotDoctors$: Observable<TimeSlotDoctorsComponent> = this.screenService.component$.pipe(
    map((component: TimeSlotDoctorsComponent) => {
      return { ...component, parsedValue: JSON.parse(component.value) };
    }),
    tap((component: TimeSlotDoctorsComponent) => {
      this.specProvider = { search: this.providerSearch(component, component.attrs.specLookup) };
      this.doctorProvider = {
        search: this.providerSearch(component, component.attrs.docLookup, () => [
          {
            attributeName: 'Service_Id',
            condition: DictionaryConditions.EQUALS,
            value: JSON.stringify(this.state$$.getValue().specLookup.id),
            valueType: DictionaryValueTypes.value,
          },
        ]),
      };
    }),
    filter((component: TimeSlotDoctorsComponent) => !!component.value),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private dictionaryToolsService: DictionaryToolsService,
  ) {}

  ngOnInit(): void {}

  handleSpecLookupValue(specLookup: ListElement): void {
    const prevState = this.state$$.getValue();
    this.docLookupControl.setValue('');
    setTimeout(() => {
      this.state$$.next({ ...prevState, specLookup: null });
      setTimeout(() => {
        this.state$$.next({ ...prevState, specLookup });
      }, 0);
    }, 0);
  }

  handleDocLookupValue(docLookup: ListElement): void {
    const prevState = this.state$$.getValue();
    this.state$$.next({ ...prevState, docLookup });
  }

  private providerSearch(
    component: TimeSlotDoctorsComponent,
    attrs: ComponentAttrsDto,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    getInitialDictionaryFilterFunc = () => [],
  ): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      let additionalParams = {};
      const filters = [...attrs.searchProvider.dictionaryFilter];
      const startFilter = attrs.searchProvider?.turnOffStartFilter;

      if (!startFilter) {
        filters[0].value = searchString;
      } else {
        additionalParams = this.dictionaryToolsService.getAdditionalParams(
          this.screenService.getStore(),
          [...attrs.searchProvider.dictionaryOptions.additionalParams],
        );
      }

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        component.parsedValue,
        this.screenService.getStore(),
        [...getInitialDictionaryFilterFunc(), ...filters],
      );

      return this.dictionaryToolsService
        .getDictionaries$(
          attrs.dictionaryType as string,
          { ...component, attrs } as CustomComponent,
          {
            ...(attrs.searchProvider.dictionaryOptions as any),
            ...dictionaryOptions,
            ...{ additionalParams },
          },
        )
        .pipe(
          map((reference) => {
            return this.dictionaryToolsService.adaptDictionaryToListItem(
              reference.data.items,
              reference.component.attrs.mappingParams,
              startFilter !== undefined && startFilter === true,
            );
          }),
        );
    };
  }

}
