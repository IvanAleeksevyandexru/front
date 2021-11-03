export enum InvitationType {
  LK_INVITATION = 'LK_INVITATION',
  // Для услуги регистрации ПМП требуется вызывать шаблоны:
  INVITATION_REGISTRY_OWNER = 'INVITATION_REGISTRY_OWNER', // В случае отправки приглашения собственнику
  INVITATION_REGISTRY_ANY = 'INVITATION_REGISTRY_ANY', // В случае отправки приглашения иному лицу
  // Для услуги регистрация ПМЖ требуется вызывать шаблон:
  INVITATION_REGISTRY_ANY_PMZ = 'INVITATION_REGISTRY_ANY_PMZ',
}
