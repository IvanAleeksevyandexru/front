import { InvitationType } from './invitation-type';

export default interface LkInvitationInputAttrs {
  label: string;
  sendEmailLabel?: string;
  fio?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  error: {
    label: string;
  };
  success: {
    label: string;
  };
  redirectLabel: string;
  templateId?: InvitationType; // default === LK_INVITATION
}
