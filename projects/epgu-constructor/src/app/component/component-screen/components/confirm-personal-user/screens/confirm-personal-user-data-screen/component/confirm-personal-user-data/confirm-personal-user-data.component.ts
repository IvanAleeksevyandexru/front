import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnChanges {
  // <-- variable
  actionType = ActionType;

  @Input() data: ConfirmUserData;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.currentAnswersService.state = this.data.value;
    }
  }
}
