import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
<<<<<<< HEAD:src/app/components/welcome-screen/welcome-screen.component.ts
import {SimpleComponentInterface} from '../../interfaces/simple-component.interface';
=======
import {EgpuResponseComponentInterface} from '../../../../../../interfaces/epgu.service.interface';
>>>>>>> ef358ca... [EPGU-267]:src/app/modules/screen/components/welcome-block/screens/welcome-block-screen/welcome-block.component.ts

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss']
})
<<<<<<< HEAD:src/app/components/welcome-screen/welcome-screen.component.ts
export class WelcomeScreenComponent implements OnInit {
  @Input() data: SimpleComponentInterface;
=======
export class WelcomeBlockComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;
>>>>>>> ef358ca... [EPGU-267]:src/app/modules/screen/components/welcome-block/screens/welcome-block-screen/welcome-block.component.ts

  @Output('nextStep') nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
