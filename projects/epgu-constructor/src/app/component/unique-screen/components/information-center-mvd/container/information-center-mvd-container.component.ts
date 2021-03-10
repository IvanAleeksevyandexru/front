import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  DictionaryToRequestI,
  InformationCenterMvdI,
} from '../interface/information-center-mvd.interface';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import {
  DictionaryFilters,
  DictionaryItem,
} from '../../../../../shared/services/dictionary/dictionary-api.types';

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
  submitLabel$ = this.screenService.submitLabel$;
  header$ = this.screenService.header$;
  isLoadingInfoCenter = false;
  sourceList: Array<ListElement> = [];
  infoCenterList: Array<DictionaryItem> = [];
  dictionaryToRequest: DictionaryToRequestI;

  constructor(
    public readonly screenService: ScreenService,
    private readonly ngUnsubscribe$: UnsubscribeService,
    private readonly dictionaryApiService: DictionaryApiService,
    private readonly dictionaryToolsService: DictionaryToolsService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.dictionaryToRequest = data.attrs.dictionaryToRequest;
      this.loadSourceDictionary(data.attrs.sourceDictionary.type);
    });
  }

  handleSelect(event: ListElement): void {
    if (event && event.id) {
      this.loadInfoCenterDictionary(this.dictionaryToRequest.type, event.id);
    } else {
      this.clearInfoCenterList();
    }
  }

  private clearInfoCenterList(): void {
    this.infoCenterList = [];
  }

  private loadInfoCenterDictionary(dictionaryName: string, id: number | string): void {
    this.clearInfoCenterList();
    this.isLoadingInfoCenter = true;
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName, this.getInfoCenterOptionsRequest(id.toString()))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((response) => {
        this.isLoadingInfoCenter = false;
        this.infoCenterList = response.items;
      });
  }

  private loadSourceDictionary(dictionaryName: string): void {
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName)
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
          condition: 'CONTAINS',
          value: { asString: id },
        },
        tx: 'e838ab71-49dd-11eb-9135-fa163e1007b9',
      },
    };
  }
}
