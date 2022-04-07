import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, exhaustMap, filter, tap } from 'rxjs/operators';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import {
  ErrorTemplate,
  NextHandler,
  TimeSlotError,
  TimeSlotErrorHandler,
  TimeSlotRequestType,
  TimeSlotTemplateType,
} from '../../typings';

import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../../core/services/error-handler/error-handler';
import { TimeSlotsConstants } from '../../../time-slots/time-slots.constants';
import { TimeSlotSmev3StateService } from '../smev3-state/time-slot-smev3-state.service';
import { IBookingErrorHandling } from '@epgu/epgu-constructor-types';
import { TimeSlotStateService } from '../state/time-slot-state.service';

@Injectable()
export class TimeSlotErrorService {
  error$$ = new BehaviorSubject<TimeSlotError>(null);

  errorHandlers: TimeSlotErrorHandler[] = [];

  errorHandling$ = combineLatest([this.error$$, this.smev3State.slotsErrorHandling$]).pipe(
    filter(([value]) => !!value),
    filter(([value]) => value.type === TimeSlotRequestType.list),
    tap(([error, slotsErrorHandling]) => this.handling(error, 0, slotsErrorHandling)),
  );

  show$$ = new Subject<string>();

  error$ = this.show$$.pipe(
    filter(() => this.hasError()),
    exhaustMap((error: string) =>
      this.modalService
        .openModal(ConfirmationModalComponent, {
          ...{
            ...COMMON_ERROR_MODAL_PARAMS(),
            buttons: [
              {
                label: 'Попробовать ещё раз',
                closeModal: true,
                value: error,
              },
            ],
          },
        })
        .pipe(catchError(() => EMPTY)),
    ),
  );

  templates$$ = new BehaviorSubject<Record<string, ErrorTemplate>>({});

  constructor(
    private smev3State: TimeSlotSmev3StateService,
    private state: TimeSlotStateService,
    private modalService: ModalService,
    public constants: TimeSlotsConstants,
    private injector: Injector,
  ) {}

  endHandler: TimeSlotErrorHandler = () => {
    this.show(`${this.constants.errorInitialiseService} (${this.getErrorMessage()})`);
    return false;
  };

  findJsonParamsForErrorHandling(
    error: TimeSlotError,
    bookingHandling: IBookingErrorHandling[],
  ): IBookingErrorHandling {
    if (typeof error !== 'object') {
      return null;
    }
    const errorCode = error.code;
    return bookingHandling?.find((param) => {
      const isCodesEqual = param.errorCode === String(errorCode);
      return param.errorMessageRegExp
        ? isCodesEqual && error.message.match(param.errorMessageRegExp)
        : isCodesEqual;
    });
  }

  handling(error: TimeSlotError, index = 0, errorHandling?: IBookingErrorHandling[]): void {
    const errorHandlingByJson = this.findJsonParamsForErrorHandling(error, errorHandling);
    if (errorHandlingByJson) {
      this.state.showModal(errorHandlingByJson.modalAttributes);
      return;
    }
    const handler = this.errorHandlers[index];
    if (!handler) {
      this.endHandler();
      return;
    }
    const next: NextHandler = (timeSlotError: TimeSlotError) => {
      this.handling(timeSlotError, index + 1, errorHandling);
    };
    handler(error, this.injector, next);
  }

  show(error: string): void {
    this.show$$.next(error);
  }

  resetHandlers(): void {
    this.errorHandlers = [];
  }

  addHandler(handler: TimeSlotErrorHandler): void {
    this.errorHandlers.push(handler);
  }

  addHandlers(handlers: TimeSlotErrorHandler[]): void {
    this.errorHandlers = this.errorHandlers.concat(handlers);
  }

  getTemplates(): Record<string, ErrorTemplate> {
    return this.templates$$.getValue();
  }

  getTemplate(type: TimeSlotTemplateType): ErrorTemplate {
    return this.getTemplates()[type];
  }

  setAllTemplates(templates: Record<string, ErrorTemplate>): void {
    this.templates$$.next(templates);
  }

  setTemplate(type: TimeSlotTemplateType, template: ErrorTemplate): void {
    const templates = this.getTemplates();
    templates[type] = template;
    this.templates$$.next(templates);
  }

  getError(): TimeSlotError {
    return this.error$$.getValue();
  }

  getErrorMessage(): string {
    return this.getError()?.message;
  }

  getErrorCode(): number {
    return this.getError()?.code;
  }

  hasError(): boolean {
    return !!this.error$$.getValue();
  }

  setError(type: TimeSlotRequestType, message: string, code: number = -1): void {
    if (code === 101 && type === TimeSlotRequestType.list) {
      message = `${code}: ${this.constants.error101ServiceUnavailable}`;
    }
    this.error$$.next({ type, message, code });
  }

  reset(): void {
    this.error$$.next(null);
  }
}
