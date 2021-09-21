import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ComponentDto, ApplicantAnswersDto } from '@epgu/epgu-constructor-types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { InvitationErrorService } from '../../invitation-error.service';

@Component({
  selector: 'epgu-constructor-invitation-error',
  templateUrl: './invitation-error.component.html',
  styleUrls: ['./invitation-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationErrorComponent implements OnInit {
  @Input() data: ComponentDto;
  @Input() applicantAnswers: ApplicantAnswersDto;
  @Input() orderId: number;
  @Input() header: string;

  public email: FormControl = new FormControl('', {
    validators: Validators.required,
  });

  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public config: ConfigService,
    private validationService: ValidationService,
    private invitationErrorService: InvitationErrorService,
  ) {}

  ngOnInit(): void {
    this.email.setValidators(
      this.validationService.customValidator((this.data as unknown) as CustomComponent),
    ); // TODO fix ComponentDto and ComponentBase
  }

  sendEmail(): void {
    const ref = this.data.attrs?.ref as string; // TODO: выяснить почему ref может быть массивом либо строкой
    const value = this.applicantAnswers[ref]?.value;
    if (!value) {
      return;
    }
    const { snils } = JSON.parse(value);
    const userData = [
      {
        type: 'SNILS',
        id: snils,
        email: this.email.value,
      },
    ];
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1`
      : `${this.config.invitationUrl}`;
    const path = `${urlPrefix}/orders/${this.orderId}/invitations/inviteToSign/send`;

    this.invitationErrorService.post(path, userData, this.data.attrs);
  }
}
