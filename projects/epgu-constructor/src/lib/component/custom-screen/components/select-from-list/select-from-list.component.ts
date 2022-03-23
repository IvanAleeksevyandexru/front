import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DictionaryRegionsErrorInterceptor } from '../../../../core/interceptor/dictionary-regions-error/dictionary-regions-error.interceptor';
import { InternalErrorInterceptor } from '../../../../core/interceptor/internal-error/internal-error.interceptor';
import SelectFromListModelAttrs from './SelectFromListModelAttrs';
import { SelectFromListElement, SelectFromListService } from './select-from-list.service';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';

@Component({
  selector: 'epgu-constructor-select-from-list',
  templateUrl: './select-from-list.component.html',
  styleUrls: ['./select-from-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectFromListService,
    UnsubscribeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InternalErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DictionaryRegionsErrorInterceptor,
      multi: true,
    },
  ],
})
export class SelectFromListComponent
  extends AbstractDictionaryLikeComponent<SelectFromListModelAttrs>
  implements OnInit {
  public paginatedData$ = this.listService.paginatedData$;
  public isFinished$ = this.listService.isFinished$;
  public leftElementCount$ = this.listService.paginatedData$.pipe(
    map((val) => {
      return Math.min(this.fullList.length - val.length, this.attrs.listIncrementLength);
    }),
  );

  private fullList: SelectFromListElement[] = [];

  constructor(
    public injector: Injector,
    private listService: SelectFromListService,
    private interpolationService: InterpolationService,
  ) {
    super(injector);
  }

  public selectItem(item: SelectFromListElement): void {
    this.control.get('value').setValue(item);
  }

  public nextPage(): void {
    this.listService.nextPage();
  }

  public resetData(): void {
    this.listService.resetData();
    this.setInitialData();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.subscribeOnValueChange();
    this.model.dictionary$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((dictionary) => !!dictionary.list.length),
      )
      .subscribe((dictionary) => {
        this.fullList = dictionary.list;
        this.processList(this.fullList);
        this.setInitialData();
        this.cdr.detectChanges();
      });
  }

  private setInitialData(): void {
    this.listService.initSize = this.attrs.listInitLength;
    this.listService.pageSize = this.attrs.listIncrementLength;
    this.listService.setData(this.fullList);
  }

  private processList(list: SelectFromListElement[]): void {
    list.forEach((item) => {
      item.checked = false;
      item.label = this.interpolationService.interpolateString(
        this.attrs.label,
        item.originalItem.attributeValues,
      );
      item.description = this.interpolationService.interpolateString(
        this.attrs.description.text,
        item.originalItem.attributeValues,
      );
    });
  }

  private subscribeOnValueChange(): void {
    this.control.get('value').valueChanges.subscribe((value) => {
      this.fullList.forEach((listElement) => {
        listElement.checked = listElement.id === value.id;
      });
    });
  }
}
