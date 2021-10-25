import { TimeSlotErrorHandler, TimeSlotTemplateType } from '../typings';
import { TimeSlotErrorService } from '../services/error/time-slot-error.service';
import { STATIC_ERROR_MESSAGE } from '../../time-slots/time-slots.constants';

export const baseHandlers: TimeSlotErrorHandler[] = [
  ((error, injector) => {
    const errorService = injector.get(TimeSlotErrorService);
    if (error.message.includes(STATIC_ERROR_MESSAGE)) {
      errorService.setTemplate(TimeSlotTemplateType.DAYS_NOT_FOUND, {
        header: 'Непредвиденная ошибка',
        description: error.message,
      });
    }
  }) as TimeSlotErrorHandler,
];
