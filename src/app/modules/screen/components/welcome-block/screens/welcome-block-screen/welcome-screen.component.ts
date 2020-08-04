import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EgpuResponseComponentInterface } from '../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss'],
})
export class WelcomeScreenComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;

  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
