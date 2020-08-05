import { Component, /* OnInit, */ Input, Output, EventEmitter } from '@angular/core';
import { UNIQUE_COMPONENT_NAME } from '../../../../constant/global';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
})
export class UniqueScreenComponent /* implements OnInit  */ {
  uniqueComponentName = UNIQUE_COMPONENT_NAME;
  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();

  nextStep() {
    this.nextStepEvent.emit();
  }
  // constructor() { }

  // ngOnInit(): void {
  // }
}
