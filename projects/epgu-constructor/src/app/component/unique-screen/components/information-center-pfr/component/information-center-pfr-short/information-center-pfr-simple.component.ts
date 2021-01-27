import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormChangeEvent, Simple } from '../../information-center-pfr.models';

@Component({
  selector: 'epgu-constructor-information-center-pfr-simple',
  templateUrl: './information-center-pfr-simple.component.html',
  styleUrls: ['./information-center-pfr-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterPfrSimpleComponent implements OnInit {
  @Input() simpleData: Simple;
  @Output() formChangeEvent = new EventEmitter<FormChangeEvent>();
  control: FormControl;

  ngOnInit(): void {
    this.control = new FormControl({ value: this.simpleData.items[0], disabled: true });
    this.formChangeEvent.emit({ value: this.control.value, isValid: true });
  }
}
