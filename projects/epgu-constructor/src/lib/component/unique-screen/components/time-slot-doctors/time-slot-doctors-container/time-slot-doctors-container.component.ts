import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ListElement } from '@epgu/epgu-lib';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { TimeSlotDoctorsComponent } from '../time-slot-doctors.interface';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { CustomComponent } from '../../../../custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-time-slot-doctors-container',
  templateUrl: './time-slot-doctors-container.component.html',
})
export class TimeSlotDoctorsContainerComponent implements OnInit {
  public specProvider;

  timeSlotDoctors$: Observable<TimeSlotDoctorsComponent> = this.screenService.component$.pipe(
    map((component: TimeSlotDoctorsComponent) => {
      return { ...component, parsedValue: JSON.parse(component.value) };
    }),
    tap((component: TimeSlotDoctorsComponent) => {
      //this.specProvider = { search: this.providerSearch() };
    }),
    filter((component: TimeSlotDoctorsComponent) => !!component.value),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private dictionaryToolsService: DictionaryToolsService,
  ) {}

  ngOnInit(): void {}

  private providerSearch(
    component: TimeSlotDoctorsComponent,
    attrs: ComponentAttrsDto,
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
        filters,
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
