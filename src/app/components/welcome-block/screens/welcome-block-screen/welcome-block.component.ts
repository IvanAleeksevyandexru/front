import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleComponentInterface} from '../../../../interfaces/simple-component.interface';

@Component({
  selector: 'app-welcome-block',
  templateUrl: './welcome-block.component.html',
  styleUrls: ['./welcome-block.component.scss']
})
export class WelcomeBlockComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  @Output('nextStep') nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
