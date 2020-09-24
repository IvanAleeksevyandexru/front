import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { NavigationService } from '../../../../../../../../shared/services/navigation/navigation.service';
import { ScreenService } from '../../../../../../../screen.service';
import { Navigation } from '../../../../../../../../form-player.types';

// TODO удалить этот компонент в пользу CUSTOM SCREEN c поддержкой actions;
@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
})
export class ConfirmPersonalUserPhoneComponent implements OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() actions: Array<{ label: string; value: string; action: string }>; // TODO HARDCODE
  @Input() isEditButtonShown: boolean;

  phoneMask = [
    '+',
    '7',
    ' ',
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];

  constructor(
    private componentStateService: ComponentStateService,
    private screenService: ScreenService,
    private navigationService: NavigationService,
  ) {}

  handleClick() {
    const action = this.actions[0];
    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options: { url: action.action },
    };
    this.navigationService.nextStep.next(navigation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.componentStateService.state = this.data;
    }
  }

  getComponentStateForNavigate() {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.componentStateService.state,
      },
    };
  }
}
