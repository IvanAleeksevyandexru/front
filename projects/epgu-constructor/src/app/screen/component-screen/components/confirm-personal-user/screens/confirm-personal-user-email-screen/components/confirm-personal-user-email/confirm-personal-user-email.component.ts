import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { ScreenService } from '../../../../../../../screen.service';
import { NavigationService } from '../../../../../../../../shared/services/navigation/navigation.service';
import { FormPlayerService } from '../../../../../../../../services/form-player/form-player.service';
import { FormPlayerNavigation } from '../../../../../../../../form-player.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email',
  templateUrl: './confirm-personal-user-email.component.html',
  styleUrls: ['./confirm-personal-user-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserEmailComponent implements OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;
  @Input() isEditButtonShown: boolean;

  constructor(
    private componentStateService: ComponentStateService,
    private screenService: ScreenService,
    private navigationService: NavigationService,
    private formPlayerService: FormPlayerService,
  ) {}

  handleClick() {
    const action = this.screenService.actions[0];
    const data = this.getComponentStateForNavigate();
    const options = { url: action.action, direction: FormPlayerNavigation.NEXT };
    this.formPlayerService.navigate(data, options);
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
