import { Component, OnInit, Input } from '@angular/core';
import {
  ConfirmUserDataFieldsStateInterface,
  ConfirmUserDataInterface,
} from '../../../../../../../interfaces/confirm-user-data.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  constructor(private componentStateService: ComponentStateService) {}

  @Input() data: ConfirmUserDataInterface;

  clickToAction(action): void {
    console.log('click to action: ', action);
  }

  ngOnInit(): void {}

  dataChange($event: Array<ConfirmUserDataFieldsStateInterface>) {
    this.componentStateService.state = JSON.stringify($event);
  }
}
