import { Component, OnInit, Input } from '@angular/core';
import { ConfirmUserDataInterface } from '../../../../../../../interfaces/confirm-user-data.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  constructor(private componentStateService: ComponentStateService) {}

  propData: ConfirmUserDataInterface;
  @Input() set data(val: ConfirmUserDataInterface) {
    this.propData = val;
    this.componentStateService.state = val.value;
  }

  clickToAction(action): void {
    console.log('click to action: ', action);
  }

  ngOnInit(): void {}
}
