import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Observable } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConstantsService } from '@epgu/ui/services/constants';
import { ListElement, ListItem } from '@epgu/ui/models/dropdown';
import { LookupComponent } from '@epgu/ui/controls';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { SUGGEST_SEPARATOR_DEFAULT } from '../../../../core/services/autocomplete/autocomplete.const';
import LookupInputModelAttrs from './LookupInputModelAttrs';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DictionaryRegionsErrorInterceptor } from '../../../../core/interceptor/dictionary-regions-error/dictionary-regions-error.interceptor';
import { InternalErrorInterceptor } from '../../../../core/interceptor/internal-error/internal-error.interceptor';

import { InviteService } from '../../../../core/services/invite/invite.service';

@Component({
  selector: 'epgu-constructor-lookup-input',
  templateUrl: './lookup-input.component.html',
  styleUrls: ['./lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
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
export class LookupInputComponent extends AbstractDictionaryLikeComponent<LookupInputModelAttrs>
  implements OnInit, AfterViewInit {
  @ViewChild('lookupComponent', { static: false }) lookupComponent: LookupComponent;
  public provider;
  public searchIconForcedShowing = false;
  public forReRenderChildLookup = true;
  public showNotFound;
  public list: ListItem[] = [];
  public searchOnFocus = false;

  suggestions$: Observable<ISuggestionItem> = this.screenService.suggestions$.pipe(
    map((suggestions) => {
      return suggestions[this.control.value?.id];
    }),
  );

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  constructor(
    public inviteService: InviteService,
    public suggestHandlerService: SuggestHandlerService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.attrs?.hint;
    this.searchOnFocus = !!this.attrs?.focusOnInitAndStartSearch;
    if (this.attrs?.searchIconForcedShowing) {
      this.searchIconForcedShowing = this.control.value?.attrs?.searchIconForcedShowing;
    }
    if (this.attrs?.searchProvider) {
      this.provider = { search: this.providerSearch() };
    }

    this.model.dictionary$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(
          (dictionary) => {
            if (
              this.searchIconForcedShowing &&
              this.attrs?.searchIconForcedShowing &&
              dictionary.list
            ) {
              this.searchIconForcedShowing = false;
              this.cdr.detectChanges();
            }
          },
          () => {
            this.searchIconForcedShowing = false;
            this.cdr.detectChanges();
          },
        ),
      )
      .subscribe((dictionary) => {
        this.list = dictionary.list;
        this.reRenderChildLookup();
      });
  }

  public ngAfterViewInit(): void {
    this.setFocusIfNeeded();
  }

  private setFocusIfNeeded(): void {
    if (this.searchOnFocus && this.lookupComponent?.searchBar) {
      this.lookupComponent.searchBar.setFocus();
    }
  }

  private reRenderChildLookup(): void {
    this.forReRenderChildLookup = false;
    this.control.markAsUntouched();
    this.control.updateValueAndValidity();

    window.requestAnimationFrame(() => {
      this.forReRenderChildLookup = true;
      this.cdr.detectChanges();
      this.setFocusIfNeeded();
    });
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      const filters = [...this.attrs?.searchProvider.dictionaryFilter];
      filters[0].value = searchString;

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        this.formService.form,
        this.screenService.getStore(),
        filters,
      );

      return this.inviteService.getFilter().pipe(
        switchMap((invite) => {
          const options = {
            ...this.attrs?.searchProvider.dictionaryOptions,
            ...dictionaryOptions,
          };
          return this.dictionaryService
            .getDictionaries$(
              this.attrs?.dictionaryType as string,
              this.control.value,
              this.inviteService.setFilterOptions(invite, options),
            )
            .pipe(
              map((reference) => {
                return this.dictionaryToolsService.adaptDictionaryToListItem(
                  reference.data.items,
                  reference.component.attrs.mappingParams,
                  false,
                );
              }),
            );
        }),
      );
    };
  }
}
