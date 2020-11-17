import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { ComponentScreenComponentTypes } from '../../../../component-screen-components.types';
import { DTOActionAction } from '../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-email',
  templateUrl: './confirm-personal-user-phone-email.component.html',
  styleUrls: ['./confirm-personal-user-phone-email.component.scss'],
})
export class ConfirmPersonalUserPhoneEmailComponent implements OnChanges {
  @Input() data: ComponentBase;
  @Input() errors: object;

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

  isEditContact() {
    const isEditPhone = this.screenService.action.action === DTOActionAction.editPhoneNumber;
    const isEmail = this.screenService.action.action === DTOActionAction.editEmail;
    return isEditPhone || isEmail;
  }
}
