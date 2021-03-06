import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Component, ChangeDetectionStrategy, Injector, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { isEqual as _isEqual } from 'lodash';
import { ListItem } from '@epgu/ui/models/dropdown';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { SUGGEST_SEPARATOR_DEFAULT } from '../../../../core/services/autocomplete/autocomplete.const';
import { CustomListDropDowns } from '../../components-list.types';
import { DropDownUpdateTypes } from './dropdown.interface';
import DropdownModelAttrs from './DropdownModelAttrs';
import AbstractDropdownLikeComponent from '../abstract-component-list-item/abstract-dropdown-like.component';

@Component({
  selector: 'epgu-constructor-dropdown',
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent extends AbstractDropdownLikeComponent<DropdownModelAttrs>
  implements OnInit, OnDestroy {
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  public dropDowns: Partial<ListItem>[];
  private dropDowns$;
  private selectedDropDown: Partial<ListItem> | null;
  private sourceDropDowns: Partial<ListItem>[];
  private isNotDuplicate: boolean;

  private readonly sourceDropDownPostfix = '_source';

  constructor(
    public dictionaryToolsService: DictionaryToolsService,
    public injector: Injector,
    public screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.isNotDuplicate = this.attrs?.isNotDuplicate;
    this.dropDowns$ = this.model.dropDown$;
    this.dropDowns$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      if (!this.isNotDuplicate) {
        this.dropDowns = data;
        return;
      }

      this.sourceDropDowns = data[`${this.sourceDropDownPostfix}`];

      if (this.sourceDropDowns) {
        this.dropDowns = this.sourceDropDowns.filter((sessionDropDown) => {
          return (
            _isEqual(sessionDropDown, this.selectedDropDown) ||
            data[this.control?.value?.id].some((dropDown) => _isEqual(sessionDropDown, dropDown))
          );
        });
      } else {
        this.sourceDropDowns = data;
        this.dropDowns = this.sourceDropDowns.slice();
      }
    });
  }

  public onChange(event?: Partial<ListItem>): void {
    if (!this.isNotDuplicate) {
      return;
    }

    if (event) {
      this.selectedDropDown = event;
      this.updateDropDowns(DropDownUpdateTypes.delete);
    } else {
      this.selectedDropDown = null;
      this.updateDropDowns(DropDownUpdateTypes.add);
    }
  }

  ngOnDestroy(): void {
    if (!this.isNotDuplicate) {
      return;
    }

    this.selectedDropDown = null;
    this.updateDropDowns(DropDownUpdateTypes.add);
  }

  private getPreparedDropDowns(dropDowns): CustomListDropDowns {
    const preparedDropDowns = [];
    preparedDropDowns[`${this.sourceDropDownPostfix}`] = this.sourceDropDowns;
    preparedDropDowns[this.control?.value.id] = dropDowns;
    return preparedDropDowns;
  }

  private updateDropDowns(type): void {
    let updatedDropDowns: Partial<ListItem>[];

    switch (type) {
      case DropDownUpdateTypes.add:
        updatedDropDowns = this.dropDowns;
        break;
      case DropDownUpdateTypes.delete:
        updatedDropDowns = this.dropDowns.filter((dropDown) => {
          return !_isEqual(dropDown, this.selectedDropDown);
        });
        break;
      default:
        updatedDropDowns = this.dropDowns;
        break;
    }

    this.dropDowns$.next(this.getPreparedDropDowns(updatedDropDowns));
  }
}
