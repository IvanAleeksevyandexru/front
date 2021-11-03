import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, delay, map, retry, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { FlatTreeControl } from '@angular/cdk/tree';

import { ListElement } from '@epgu/ui/models/dropdown';

import {
  ModalBaseComponent,
  EventBusService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { DictionaryFilters } from '@epgu/epgu-constructor-types';

import { DictionaryApiService } from '../../../services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../services/dictionary/dictionary-tools.service';

import { FlatNode, FormField } from '../complex-choice-dictionary.models';

import { DynamicDatasource, dataMapping } from '../utils';

@Component({
  selector: 'epgu-constructor-complex-choice-dictionary-modal',
  templateUrl: './complex-choice-dictionary-modal.component.html',
  styleUrls: ['./complex-choice-dictionary-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplexChoiceDictionaryModalComponent extends ModalBaseComponent implements OnInit {
  isLoading = false;
  title: string;
  dictionaryType: string;
  dictionaryFilter: DictionaryFilters;
  dictionaryList: ListElement[];
  selectedItems: ListElement[];
  items: ListElement[];
  placeholder$ = new BehaviorSubject('Поиск по списку');
  form: FormGroup;

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  readonly buttons = [
    {
      label: 'Применить',
      handler: (): void => this.onClose(),
    },
  ];
  readonly formField = FormField;

  dataSource: DynamicDatasource;

  constructor(
    public injector: Injector,
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.eventBusService
      .on(`closeModalEvent_complex-choice-dictionary`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.closeModal());
    this.getDictionary();
  }

  hasChild = (_: number, node: FlatNode): boolean => node?.expandable;

  updateForm(): void {
    this.dataSource.flattenedData
      .asObservable()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((items) => {
        const listItems = items.map((item) => ({
          id: item.id,
          originalItem: item.originalItem,
          text: item.text,
        }));
        this.items = [...this.items, ...listItems];
        this.initializeForm(this.items);
      });
  }

  provideSearchValue(): void {
    this.dataSource.updateFilteredItems(this.form.get(this.formField.search) as FormControl);
  }

  onClose(): void {
    const items = Object.entries(this.form.get(this.formField.checkboxGroup).value)
      .filter(([, value]) => value)
      .reduce<ListElement[]>((acc, [key, value]) => {
        const selectedItem = value && this.items.find((item) => item.id === key);
        return [...acc, selectedItem];
      }, []);
    this.closeModal(items);
  }

  private initializeForm(items: ListElement[]): void {
    this.form = this.fb.group({
      [this.formField.search]: [''],
      [this.formField.checkboxGroup]: this.fb.group(
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
      .get(this.formField.checkboxGroup)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        const { length } = Object.values(value).filter((val) => val);
        this.updatePlaceholder(length);
      });
    this.provideSearchValue();
  }

  private getDictionary(): void {
    const dictionary = this.dictionaryList ? of(this.dictionaryList) : this.getDictionaryData();
    dictionary.subscribe((items) => {
      if (items.length === 0) {
        this.closeModal(new Error('Dictionary error'));
        return;
      }
      this.items = items;
      const data = dataMapping(items);
      this.dataSource = new DynamicDatasource(
        this.treeControl,
        data as FlatNode[],
        this.dictionaryApiService,
        this.dictionaryToolsService,
        this.dictionaryType,
        this.dictionaryFilter,
      );
      this.treeControl.dataNodes = data as FlatNode[];
      this.initializeForm(items);
      this.updatePlaceholder(this.selectedItems.length);
      this.updateForm();
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  private getDictionaryData(): Observable<ListElement[]> {
    this.isLoading = true;
    return this.dictionaryApiService
      .getDictionary(this.dictionaryType, { filter: this.dictionaryFilter.filter })
      .pipe(
        delay(500),
        map((response) => {
          if (response.error.code !== 0) {
            throw new Error('An unexpected error occurred');
          }
          return this.dictionaryToolsService.adaptDictionaryToListItem(response.items);
        }),
        retry(0),
        catchError(() => of([])),
      );
  }

  private updatePlaceholder(length: number): void {
    this.placeholder$.next(length ? `Выбрано ${length}` : 'Поиск по списку');
  }
}
