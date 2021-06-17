import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ListElement } from '@epgu/epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  ComponentDictionaryFilterDto,
  DictionaryConditions,
  DictionaryFilters,
} from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenStore } from '../../../../../screen/screen.types';
import {
  DictionaryToRequestI,
  InformationCenterMvdI,
} from '../interface/information-center-mvd.interface';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryToolsService,
  ComponentValue,
} from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryItem } from '../../../../../shared/services/dictionary/dictionary-api.types';

@Component({
  selector: 'epgu-constructor-information-center-mvd-container',
  templateUrl: './information-center-mvd-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterMvdContainerComponent implements OnInit {
  data$: Observable<InformationCenterMvdI> = this.screenService.component$ as Observable<
    InformationCenterMvdI
  >;
  isLoading$ = this.screenService.isLoading$;
  header$ = this.screenService.header$;
  isLoadingInfoCenter = false;
  sourceList: Array<ListElement> = [];
  infoCenterList: Array<DictionaryItem> = [];
  dictionaryToRequest: DictionaryToRequestI;
  screenStore: ScreenStore;
  componentValue: ComponentValue;

  constructor(
    public readonly screenService: ScreenService,
    private readonly ngUnsubscribe$: UnsubscribeService,
    private readonly dictionaryApiService: DictionaryApiService,
    private readonly dictionaryToolsService: DictionaryToolsService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.componentValue = JSON.parse(data.value || '{}');
      this.screenStore = this.screenService.getStore();
      this.dictionaryToRequest = data.attrs.dictionaryToRequest;
      this.loadSourceDictionary(
        data.attrs.sourceDictionary.type,
        data.attrs.sourceDictionary.dictionaryFilter,
      );
    });
  }

  handleSelect(event: ListElement): void {
    if (event && event.id) {
      this.loadInfoCenterDictionary(
        this.dictionaryToRequest.type,
        event.id,
        this.dictionaryToRequest.dictionaryFilter,
      );
    } else {
      this.clearInfoCenterList();
    }
  }

  private clearInfoCenterList(): void {
    this.infoCenterList = [];
  }

  private loadInfoCenterDictionary(
    dictionaryName: string,
    id: number | string,
    dictionaryFilter?: Array<ComponentDictionaryFilterDto> | undefined,
  ): void {
    this.clearInfoCenterList();
    this.isLoadingInfoCenter = true;
    this.dictionaryApiService
      .getMvdDictionary(
        dictionaryName,
        dictionaryFilter !== undefined
          ? this.dictionaryToolsService.getFilterOptions(
              this.componentValue,
              this.screenStore,
              dictionaryFilter,
            )
          : this.getInfoCenterOptionsRequest(id.toString()),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((response) => {
        this.isLoadingInfoCenter = false;
        this.infoCenterList = response.items;
      });
  }

  private loadSourceDictionary(
    dictionaryName: string,
    dictionaryFilter?: Array<ComponentDictionaryFilterDto> | undefined,
  ): void {
    this.dictionaryApiService
      .getMvdDictionary(
        dictionaryName,
        dictionaryFilter !== undefined
          ? this.dictionaryToolsService.getFilterOptions(
              this.componentValue,
              this.screenStore,
              dictionaryFilter,
            )
          : {},
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.sourceList = this.dictionaryToolsService.adaptDictionaryToListItem(data.items);
      });
  }

  private getInfoCenterOptionsRequest(id: string): DictionaryFilters {
    return {
      filter: {
        simple: {
          attributeName: 'REGION_CODE',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: id },
        },
        tx: 'e838ab71-49dd-11eb-9135-fa163e1007b9',
      },
    };
  }
}
