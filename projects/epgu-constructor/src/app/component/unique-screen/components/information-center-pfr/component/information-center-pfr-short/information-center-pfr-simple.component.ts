import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FormChangeEvent, PfrAreaType, Simple } from '../../information-center-pfr.models';

@Component({
  selector: 'epgu-constructor-information-center-pfr-simple',
  templateUrl: './information-center-pfr-simple.component.html',
  styleUrls: ['./information-center-pfr-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterPfrSimpleComponent implements OnInit {
  @Input() simpleData: Simple;
  @Output() formChangeEvent = new EventEmitter<FormChangeEvent>();

  ngOnInit(): void {
    this.formChangeEvent.emit({
      value: { [PfrAreaType.territory]: this.simpleData.items[0] },
      isValid: true,
    });
  }
}
