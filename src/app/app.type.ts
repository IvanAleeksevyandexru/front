export const LOCAL_STORAGE_KEY = 'EPGU_FORM_PLAYER_TEST_STAND_CONFIG';

export interface AppConfig {
  serviceId: string;
  targetId: string;
  orderId?: string;
  invited?: boolean;
  canStartNew?: boolean;
  initState?: string;
  apiUrl?: string;
}
