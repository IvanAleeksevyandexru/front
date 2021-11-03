export interface InvitationErrorData {
  type: string;
  id: string;
  email: string;
}

export interface LkInvitationInputData {
  invitedUserEmail: string;
  additionalParams: {
    fio: string;
    gnr?: string;
  };
}
