import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { ComponentScreenComponentTypes } from '../../../../component-screen-components.types';
import { DTOActionAction } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-email',
  templateUrl: './confirm-personal-user-phone-email.component.html',
  styleUrls: ['./confirm-personal-user-phone-email.component.scss'],
})
export class ConfirmPersonalUserPhoneEmailComponent implements OnChanges, OnInit {
  data$: Observable<ComponentBase> = this.screenService.component$;
  data: ComponentBase;
  isEditContactAction: boolean;
  componentScreenComponentTypes = ComponentScreenComponentTypes;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.data = data;
      this.isEditContactAction = this.getIsEditContactAction();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { value } = changes.data.currentValue;
    if (value) {
      this.currentAnswersService.isValid = true;
      this.currentAnswersService.state = this.data?.value;
    } else {
      this.currentAnswersService.isValid = false;
    }
  }

  getIsEditContactAction(): boolean {
    const isEditPhone = this.screenService.action.action === DTOActionAction.editPhoneNumber;
    const isEditEmail = this.screenService.action.action === DTOActionAction.editEmail;
    return isEditPhone || isEditEmail;
  }
}
