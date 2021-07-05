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
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import {
  ConfirmUserDataError,
  ConfirmUserDataFieldsState,
  ConfirmUserDataState,
} from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';

const defaultStyle: ConfirmUserDataStyle = {
  group: 'mb-16',
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

  public preparedData: Array<ConfirmUserDataFieldsState> = [];
  public style: ConfirmUserDataStyle;
  public errors: ConfirmUserDataError[];
  public currentEaisdoState: EaisdoStateTypes;

  constructor(
    private eaisdoGroupCostService: EaisdoGroupCostService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.style = this.data.attrs?.style || defaultStyle;
    this.eaisdoGroupCostService.currentState$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((state: EaisdoStateTypes) => {
        this.currentEaisdoState = state;
        this.cdr.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states, errors = [] } = (this.data.presetValue
        ? JSON.parse(this.data.presetValue)
        : JSON.parse(this.data.value)) as ConfirmUserDataState;
      this.preparedData = states;
      this.errors = errors;
    }
  }

  calculateVisibility(idx): boolean {
    const { fieldGroups } = this.data.attrs;
    const currentField = fieldGroups?.[idx];
    return (
      typeof currentField.visibilityLabel === 'undefined' ||
      currentField.visibilityLabel === this.currentEaisdoState
    );
  }
}
