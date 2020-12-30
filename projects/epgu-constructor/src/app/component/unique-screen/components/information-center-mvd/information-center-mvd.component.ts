import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import {
  DictionaryToRequestI,
  InformationCenterMvdI,
} from './interface/information-center-mvd.interface';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { DictionaryUtilities } from '../select-map-object/dictionary-utilities';
import { DictionaryItem } from '../../../shared/services/dictionary-api/dictionary-api.types';

@Component({
  selector: 'epgu-constructor-information-center-mvd',
  templateUrl: './information-center-mvd.component.html',
  styleUrls: ['./information-center-mvd.component.scss'],
})
export class InformationCenterMvdComponent implements OnInit {
  data$: Observable<InformationCenterMvdI> = this.screenService.component$ as Observable<
    InformationCenterMvdI
  >;
  display$: Observable<DisplayDto> = this.screenService.display$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  submitLabel$: Observable<string> = this.screenService.submitLabel$;

  select = new FormControl();
  sourceList: Array<ListElement> = [];
  infoCenterList: Array<DictionaryItem> = [];
  dictionaryToRequest: DictionaryToRequestI;
  constructor(
    public readonly screenService: ScreenService,
    private readonly ngUnsubscribe$: UnsubscribeService,
    private readonly dictionaryApiService: DictionaryApiService,
  ) {}

  ngOnInit(): void {
    this.data$
      .pipe(takeUntil(this.ngUnsubscribe$), takeUntil(this.screenService.isNextScreen$))
      .subscribe((data) => {
        this.dictionaryToRequest = data.attrs.dictionaryToRequest;
        this.loadSourceDictionary(data.attrs.sourceDictionary.type);
      });
  }

  handleSelect(event: ListElement): void {
    this.loadInfoCenterDictionary(this.dictionaryToRequest.type, event.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private loadInfoCenterDictionary(dictionaryName: string, id: number | string): void {
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((response) => {
        this.infoCenterList = response.items;
      });
  }

  private loadSourceDictionary(dictionaryName: string): void {
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        // @todo вынести DictionaryUtilities из select-map-object на более глобальный уровень
        this.sourceList = DictionaryUtilities.adaptDictionaryToListItem(data.items);
      });
  }
}
