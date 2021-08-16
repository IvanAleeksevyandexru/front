import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { ListElement } from '@epgu/epgu-lib';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  catchError,
  debounceTime,
  delay,
  map,
  mapTo,
  retry,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';

import {
  ModalBaseComponent,
  EventBusService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { DictionaryFilters } from '@epgu/epgu-constructor-types';
import { DictionaryApiService } from '../../../services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../services/dictionary/dictionary-tools.service';

import { FormField } from '../multiple-choice-dictionary.models';

@Component({
  selector: 'epgu-constructor-multi-choice-dictionary-modal',
  templateUrl: './multi-choice-dictionary-modal.component.html',
  styleUrls: ['./multi-choice-dictionary-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiChoiceDictionaryModalComponent extends ModalBaseComponent implements OnInit {
  isLoading = false;
  title: string;
  dictionaryType: string;
  dictionaryFilter: DictionaryFilters;
  dictionaryList: ListElement[];
  selectedItems: ListElement[];
  items: ListElement[];
  form: FormGroup;
  filteredItems$: Observable<ListElement[]> = of([]);
  isSelectAll$ = new BehaviorSubject<boolean>(false);
  inputPlaceholder$ = new BehaviorSubject('Поиск по списку');
  readonly formField = FormField;
  readonly buttons = [
    {
      label: 'Применить',
      handler: (): void => this.onClose(),
    },
  ];

  constructor(
    public injector: Injector,
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.eventBusService
      .on(`closeModalEvent_multi-choice-dictionary`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.closeModal());

    this.getDictionary();
  }

  public getFilteredItems$(): Observable<ListElement[]> {
    return merge(
      this.form.get(this.formField.input).valueChanges.pipe(debounceTime(300)),
      this.isSelectAll$.pipe(mapTo('')),
    ).pipe(
      startWith(''),
      map((value) => {
        if (value) {
          const reg = new RegExp(value, 'i');
          return this.items.filter((item) => reg.test(item.text));
        }

        return this.items;
      }),
    );
  }

  public select(isAll: boolean): void {
    const update = (
      isSelect: boolean,
      value: { [key: string]: boolean },
    ): { [key: string]: boolean } =>
      Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: isSelect,
        }),
        {},
      );
    const control = this.form.get(this.formField.checkbox);
    control.setValue(update(isAll, control.value));
    const { length } = Object.values(control.value).filter((value) => value);
    this.updateInputPlaceholder(length);
    this.isSelectAll$.next(isAll);
  }

  public onClose(): void {
    const selectedItems = Object.entries(this.form.get(this.formField.checkbox).value)
      .filter(([, value]) => value)
      .reduce<ListElement[]>((acc, [key, value]) => {
        const selectedItem = value && this.items.find((item) => item.id === key);
        return [...acc, selectedItem];
      }, []);
    this.closeModal(selectedItems);
  }

  private initForm(items: ListElement[]): void {
    this.form = this.fb.group({
      [this.formField.input]: [null],
      [this.formField.checkbox]: this.fb.group(
        items.reduce((acc, item) => {
          const control = new FormControl(
            this.selectedItems.some((selectItem) => selectItem.id === item.id),
          );

          return {
            ...acc,
            [item.id]: control,
          };
        }, {}),
      ),
    });

    this.form
      .get(this.formField.checkbox)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        const { length } = Object.values(value).filter((val) => val);
        this.updateInputPlaceholder(length);
      });
  }

  private getDictionary(): void {
    const dictionary = this.dictionaryList ? of(this.dictionaryList) : this.fetchDictionary();
    dictionary.subscribe((items) => {
      if (items.length === 0) {
        this.closeModal(new Error('Dictionary error'));
        return;
      }

      this.items = items;
      this.initForm(items);
      this.updateInputPlaceholder(this.selectedItems.length);
      this.isSelectAll$.next(this.selectedItems.length === items.length);
      this.filteredItems$ = this.getFilteredItems$();
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private fetchDictionary(): Observable<ListElement[]> {
    this.isLoading = true;
    return this.dictionaryApiService
      .getDictionary(this.dictionaryType, { filter: this.dictionaryFilter.filter })
      .pipe(
        delay(500),
        map((response) => {
          if (response.error.code !== 0) {
            throw new Error('Dictionary error');
          }
          return this.dictionaryToolsService.adaptDictionaryToListItem(response.items);
        }),
        retry(1),
        catchError(() => of([])),
      );
  }

  private updateInputPlaceholder(length: number): void {
    this.inputPlaceholder$.next(length ? `Выбрано ${length}` : 'Поиск по списку');
  }
}
