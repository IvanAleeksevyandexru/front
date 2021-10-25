import { TimeSlotErrorHandler, TimeSlotTemplateType } from '../typings';
import { NO_DATA_MESSAGE } from '../../time-slots/time-slots.constants';
import {
  NO_DOCTORS_AVAILABLE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from '../../../../../core/services/error-handler/error-handler';
import { ScreenService } from '../../../../../screen/screen.service';
import { TimeSlotErrorService } from '../services/error/time-slot-error.service';
import { TimeSlotStateService } from '../services/state/time-slot-state.service';
import { FormPlayerService } from '../../../../../form-player/services/form-player/form-player.service';
import { TimeSlotSmev3Service } from '../services/smev3/time-slot-smev3.service';

export const doctorHandlers: TimeSlotErrorHandler[] = [
  ((error, injector, next) => {
    const screenService = injector.get(ScreenService);
    const errorService = injector.get(TimeSlotErrorService);
    if (screenService.component.attrs.slotsNotFoundTemplate) {
      errorService.setTemplate(TimeSlotTemplateType.DAYS_NOT_FOUND, null);
      return;
    }
    next(error);
  }) as TimeSlotErrorHandler,
  ((error, injector, next) => {
    const errorService = injector.get(TimeSlotErrorService);
    if (error.message.includes(NO_DATA_MESSAGE)) {
      errorService.setTemplate(TimeSlotTemplateType.DAYS_NOT_FOUND, {
        header: 'Нет свободного времени для приёма',
        description: 'Этот врач занят на ближайшие 14 дней. Выберите другого специалиста',
      });
      return;
    }
    next(error);
  }) as TimeSlotErrorHandler,
  ((error, injector, next) => {
    const state = injector.get(TimeSlotStateService);
    const formPlayer = injector.get(FormPlayerService);
    if (error.message.includes('Закончилось время')) {
      state
        .showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
        .toPromise()
        .then((result) => {
          if (result) {
            formPlayer.initData();
          }
        });
      return;
    }
    next(error);
  }) as TimeSlotErrorHandler,
  ((error, injector) => {
    const data = injector.get(TimeSlotSmev3Service);
    const state = injector.get(TimeSlotStateService);
    const errorService = injector.get(TimeSlotErrorService);
    const formPlayer = injector.get(FormPlayerService);
    const message = data.clearMessage(error.message);
    NO_DOCTORS_AVAILABLE.text = NO_DOCTORS_AVAILABLE.text.replace(/\{textAsset\}?/g, message);
    state
      .showModal(NO_DOCTORS_AVAILABLE)
      .toPromise()
      .then((result) => {
        if (result) {
          formPlayer.initData();
        }
      });

    errorService.setTemplate(TimeSlotTemplateType.DAYS_NOT_FOUND, {
      header: 'Нет свободного времени для приёма',
      description: message,
    });
    return;
  }) as TimeSlotErrorHandler,
];
