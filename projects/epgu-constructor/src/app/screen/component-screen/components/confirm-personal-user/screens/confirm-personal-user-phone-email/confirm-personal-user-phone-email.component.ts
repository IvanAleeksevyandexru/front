import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../../../../../config/config.service';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ScreenService } from '../../../../../screen.service';
import { ComponentBase } from '../../../../../screen.types';
import { ComponentScreenComponentTypes } from '../../../../component-screen.types';
import { ActionType } from '../../../../../../services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-email',
  templateUrl: './confirm-personal-user-phone-email.component.html',
  styleUrls: ['./confirm-personal-user-phone-email.component.scss'],
})
export class ConfirmPersonalUserPhoneEmailComponent implements OnChanges {
  @Input() data: ComponentBase;
  @Input() errors: object;

  actionType = ActionType;
  componentScreenComponentTypes = ComponentScreenComponentTypes;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { value } = changes.data.currentValue;
    if (value) {
      this.currentAnswersService.isValid = true;
      this.currentAnswersService.state = this.data?.value;
    } else {
      this.currentAnswersService.isValid = false;
    }
  }
}
