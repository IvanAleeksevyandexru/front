/*
 * Public API Surface of epgu-constructor
 */

export * from './app/form-player/form-player.component';
export * from './app/form-player/form-player.module';
export { LoadServiceDeviceType } from './app/core/services/device-detector/device-detector.service';
export { LOCAL_STORAGE_PLATFORM_TYPE } from './app/core/services/config/config.types';
export { ConfigService } from './app/core/services/config/config.service';
export { UnsubscribeService } from './app/core/services/unsubscribe/unsubscribe.service';
export { ServiceEntity, ServiceInfo, FormPlayerContext } from './app/form-player/form-player.types';

