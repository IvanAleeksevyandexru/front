import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { InvitationType } from './invitation-type';
import LkInvitationInputAttrs from './lk-invitation-input-attrs';
import LkInvitationData from './lk-invitation-data';
import { InvitationErrorService } from '../../invitation-error.service';

@Component({
  selector: 'epgu-constructor-lk-invitation-input',
  templateUrl: './lk-invitation-input.component.html',
  styleUrls: ['./lk-invitation-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LkInvitationInputComponent implements OnInit {
  @Input() data: ComponentDto;
  @Input() header: string;

  public email: FormControl = new FormControl('');

  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  public constructor(
    public config: ConfigService,
    private validationService: ValidationService,
    private invitationErrorService: InvitationErrorService,
  ) {}

  public ngOnInit(): void {
    this.email.setValidators([
      Validators.required,
      this.validationService.customValidator((this.data as unknown) as CustomComponent),
    ]); // TODO fix ComponentDto and ComponentBase
  }

  public sendEmail(): void {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1`
      : `${this.config.invitationUrl}`;
    const { templateId = InvitationType.LK_INVITATION } = this.data.attrs as LkInvitationInputAttrs;
    const path = `${urlPrefix}/register/${templateId}`;

    this.invitationErrorService.post<LkInvitationData>(
      path,
      this.getInvitationData(),
      this.data.attrs,
    );
  }

  private getInvitationData(): LkInvitationData {
    const { gender = null } = this.data.attrs as LkInvitationInputAttrs;

    const data: LkInvitationData = {
      invitedUserEmail: this.email.value,
      additionalParams: { fio: this.getFullName() },
    };

    if (gender) {
      data.additionalParams.gnr = gender;
    }

    return data;
  }

  private getFullName(): string {
    const { fio = null, firstName = null, lastName = null, middleName = null } = this.data.attrs;

    return (fio || `${lastName} ${firstName} ${middleName || ''}`).trim();
  }
}
