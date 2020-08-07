import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();

  nextStep() {
    this.nextStepEvent.next();
  }
}
