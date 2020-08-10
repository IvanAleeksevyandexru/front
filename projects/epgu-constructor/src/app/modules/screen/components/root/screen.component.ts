import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit {
  screenComponentName = SCREEN_COMPONENT_NAME;
  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();

  ngOnInit(): void {}

  nextStep() {
    this.nextStepEvent.emit();
  }
}
