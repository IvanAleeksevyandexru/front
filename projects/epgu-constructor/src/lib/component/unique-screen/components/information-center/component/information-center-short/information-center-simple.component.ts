import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FormChangeEvent, PfrAreaType, Simple } from '../../information-center.models';

@Component({
  selector: 'epgu-constructor-information-center-simple',
  templateUrl: './information-center-simple.component.html',
  styleUrls: ['./information-center-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterSimpleComponent implements OnInit {
  @Input() simpleData: Simple;
  @Output() formChangeEvent = new EventEmitter<FormChangeEvent>();

  ngOnInit(): void {
    this.formChangeEvent.emit({
      value: { [PfrAreaType.territory]: this.simpleData.items[0] },
      isValid: true,
    });
  }
}
