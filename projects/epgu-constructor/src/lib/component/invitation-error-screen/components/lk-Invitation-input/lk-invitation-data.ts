export default interface LkInvitationData {
  invitedUserEmail: string;
  additionalParams: {
    fio: string;
    gnr?: string;
  };
}
