import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Clarifications } from 'epgu-constructor-types';
import { get as _get } from 'lodash';
import { EmployeeType } from '../../employee-history.types';

@Component({
  selector: 'epgu-constructor-employee-history-clarification',
  templateUrl: './employee-history-clarification.component.html',
  styleUrls: ['./employee-history-clarification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeHistoryClarificationComponent implements OnChanges {
  @Input() type: string;
  @Input() clarificationId: string;
  @Input() clarifications: Record<EmployeeType, Clarifications>;
  isShow: boolean;

  ngOnChanges(): void {
    this.isShow = _get(this.clarifications, [this.type, this.clarificationId]);
  }
}
