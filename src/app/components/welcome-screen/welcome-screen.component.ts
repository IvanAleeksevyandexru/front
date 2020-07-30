import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleComponentInterface} from '../../interfaces/simple-component.interface';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  @Output('nextStep') nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
