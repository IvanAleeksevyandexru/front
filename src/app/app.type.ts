export const LOCAL_STORAGE_KEY = 'EPGU_FORM_PLAYER_TEST_STAND_CONFIG';

export interface AppConfig {
  serviceId: string;
  targetId: string;
  serviceInfo: string;
  orderId?: number;
  invited?: boolean;
  canStartNew?: boolean;
  initState?: string;
  configId?: string;
  queryParams?: string;
  gepsId?: number;
}
