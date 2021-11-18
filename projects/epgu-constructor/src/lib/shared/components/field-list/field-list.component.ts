import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ConfirmUserDataStyle, ComponentDto } from '@epgu/epgu-constructor-types';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { get } from 'lodash';
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

import {
  ConfirmUserDataError,
  ConfirmUserDataFieldsState,
  ConfirmUserDataState,
  ConfirmUserDataAdaptiveField,
} from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

const defaultStyle: ConfirmUserDataStyle = {
  group: 'mb-24',
  groupTitle: 'mb-12',
  value: '',
  label: 'mb-4',
  field: 'mb-16',
  list: '',
  divider: 'mb-32',
};

@Component({
  selector: 'epgu-constructor-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldListComponent implements OnInit, OnChanges {
  @Input() data: ComponentDto;

  public preparedData: ConfirmUserDataFieldsState[] = [];
  public style: ConfirmUserDataStyle;
  public errors: ConfirmUserDataError[];
  public currentEaisdoState: EaisdoStateTypes;

  constructor(
    private eaisdoGroupCostService: EaisdoGroupCostService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
    private currentAnswersService: CurrentAnswersService,
    private jsonHelperService: JsonHelperService,
  ) {}

  ngOnInit(): void {
    this.style = this.data.attrs?.style || defaultStyle;
    this.eaisdoGroupCostService.currentState$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((state: EaisdoStateTypes) => {
        this.currentEaisdoState = state;
        setTimeout(() => {
          this.transformData();
          this.cdr.detectChanges();
        }, 0);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states, errors = [] } = (this.data.presetValue
        ? JSON.parse(this.data.presetValue)
        : JSON.parse(this.data.value)) as ConfirmUserDataState;
      this.preparedData = states;
      this.errors = errors;

      if (this.data.attrs?.isNeedToGroupErrors && this.errors.length > 1) {
        this.groupErrors();
      }
    }
  }

  transformData(): void {
    this.preparedData = this.preparedData.map((listItem: ConfirmUserDataFieldsState) => {
      const newListItem = JSON.parse(JSON.stringify(listItem));
      newListItem.groupName = this.transformString(listItem.groupName);
      newListItem.fields = newListItem.fields.map((fieldItem: ConfirmUserDataAdaptiveField) => {
        const newFieldItem = JSON.parse(JSON.stringify(fieldItem));
        newFieldItem.label = this.transformString(newFieldItem.label);
        newFieldItem.value = this.transformString(newFieldItem.value);
        return newFieldItem;
      });
      return newListItem;
    });
  }

  calculateVisibility(idx: number): boolean {
    const { fieldGroups } = this.data.attrs;
    const currentField = fieldGroups?.[idx];
    if (currentField) {
      return (
        typeof currentField.visibilityLabel === 'undefined' ||
        currentField.visibilityLabel === this.currentEaisdoState
      );
    }
    return true;
  }

  private transformString(str: string): string {
    if (!str) return '';

    const regexp = /\$?{([^{]+)}/g;

    return str.replace(regexp, (ignore) => {
      const path = ignore.replace(/[&/\\#,+()$~%'":*?<>{}]/g, '');
      const parsedPath = path.split('.');
      const componentId = parsedPath.shift();
      const componentValue = this.currentAnswersService.state[componentId]?.value;
      const parsedComponentValue = this.jsonHelperService.tryToParse(componentValue, {});
      const newValue = get(
        parsedComponentValue,
        parsedPath.splice(1, parsedPath.length - 1).join('.'),
        undefined,
      );
      return newValue == null ? ignore : newValue;
    });
  }

  private groupErrors(): void {
    for (let i = 0; i < this.errors.length; i += 1) {
      for (let j = i + 1; j < this.errors.length; j += 1) {
        if (this.errors[i].title === this.errors[j].title) {
          if (this.errors[i].desc !== this.errors[j].desc) {
            this.errors[i].desc += ` <br> ${this.errors[j].desc}`;
          }
          this.errors.splice(j, 1);
        }
      }
    }
  }
}
