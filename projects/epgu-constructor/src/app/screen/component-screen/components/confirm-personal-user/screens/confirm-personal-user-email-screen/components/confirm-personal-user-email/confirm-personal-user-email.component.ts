import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ScreenService } from '../../../../../../../screen.service';
import { NavigationService } from '../../../../../../../../shared/services/navigation/navigation.service';
import { Navigation } from '../../../../../../../../form-player.types';

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
    private currentAnswersService: CurrentAnswersService,
    private screenService: ScreenService,
    private navigationService: NavigationService,
  ) {}

  handleClick() {
    const action = this.screenService.actions[0];
    const navigation: Navigation = {
      payload: this.getComponentStateForNavigate(),
      options: { url: action.action },
    };
    this.navigationService.nextStep.next(navigation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = this.data;
    }
  }

  getComponentStateForNavigate() {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: this.currentAnswersService.state,
      },
    };
  }
}
