import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ApplicantAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../custom-screen/components-list.types';
import { InvitationService } from '../../invitation.service';
import { InvitationTypes } from '../../invitation.types';

import { InvitationType } from './invitation-type';
import { InvitationErrorData, LkInvitationInputData } from './invitation-data';
import InvitationAttrs from './invitation-attrs';

@Component({
  selector: 'epgu-constructor-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationComponent implements OnInit {
  @Input() applicantAnswers: ApplicantAnswersDto;
  @Input() componentType: string;
  @Input() data: ComponentDto;
  @Input() header: string;
  @Input() orderId: number;

  public email: FormControl = new FormControl('');
  public validationShowOn: ValidationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  private urlPrefix: string;

  constructor(
    public config: ConfigService,
    private validationService: ValidationService,
    private invitationService: InvitationService,
  ) {}

  public ngOnInit(): void {
    this.email.setValidators([
      Validators.required,
      this.validationService.customValidator((this.data as unknown) as CustomComponent),
    ]); // TODO fix ComponentDto and ComponentBase

    this.urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1`
      : `${this.config.invitationUrl}`;
  }

  public sendEmail(): void {
    this.invitationService.post(this.path, this.invitationData, this.data.attrs);
  }

  private get path(): string {
    if (this.componentType === InvitationTypes.lkInvitationInput) {
      return `${this.urlPrefix}/register/${
        this.data.attrs.templateId ?? InvitationType.LK_INVITATION
      }`;
    }

    return `${this.urlPrefix}/orders/${this.orderId}/invitations/inviteToSign/send`;
  }

  private get invitationData(): InvitationErrorData[] | LkInvitationInputData | '' {
    if (this.componentType === InvitationTypes.lkInvitationInput) {
      const { gender } = this.data.attrs as InvitationAttrs;

      return {
        invitedUserEmail: this.email.value,
        additionalParams: {
          fio: this.fullName,
          ...(gender && { gnr: gender }),
        },
      };
    }

    const ref = this.data.attrs?.ref as string; // TODO: выяснить почему ref может быть массивом либо строкой
    const value = this.applicantAnswers[ref]?.value;

    if (!value) {
      return '';
    }

    return [
      {
        type: 'SNILS',
        id: JSON.parse(value).snils,
        email: this.email.value,
      },
    ];
  }

  private get fullName(): string {
    const { fio = null, firstName = null, lastName = null, middleName = null } = this.data.attrs;

    return (fio || `${lastName} ${firstName} ${middleName || ''}`).trim();
  }
}
