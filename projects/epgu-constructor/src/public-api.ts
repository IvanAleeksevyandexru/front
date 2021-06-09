/*
 * Public API Surface of epgu-constructor
 */

export * from './lib/form-player/form-player.component';
export * from './lib/form-player/form-player.module';
export { LoadServiceDeviceType } from './lib/core/services/device-detector/device-detector.service';
export { LOCAL_STORAGE_PLATFORM_TYPE } from './lib/core/services/config/config.types';
export { ConfigService } from './lib/core/services/config/config.service';
export { UnsubscribeService } from './lib/core/services/unsubscribe/unsubscribe.service';
export { ServiceEntity, ServiceInfo, FormPlayerContext } from './lib/form-player/form-player.types';

