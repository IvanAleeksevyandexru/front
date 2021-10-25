import { Injectable, Injector } from '@angular/core';
import {
  ErrorTemplate,
  nextHandler,
  TimeSlotError,
  TimeSlotErrorHandler,
  TimeSlotRequestType,
  TimeSlotTemplateType,
} from '../../typings';

import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { catchError, exhaustMap, filter, tap } from 'rxjs/operators';

import { TimeSlotSmev3StateService } from '../smev3-state/time-slot-smev3-state.service';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../../core/services/error-handler/error-handler';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotsConstants } from '../../../time-slots/time-slots.constants';

@Injectable()
export class TimeSlotErrorService {
  error$$ = new BehaviorSubject<TimeSlotError>(null);
  errorHandlers: TimeSlotErrorHandler[] = [];

  errorHandling$ = this.error$$.pipe(
    filter((value) => !!value),
    filter((value) => value.type === TimeSlotRequestType.list),
    tap((error) => this.handling(error)),
  );

  show$$ = new Subject<string>();

  error$ = this.show$$.pipe(
    filter(() => this.hasError()),
    exhaustMap((error: string) =>
      this.modalService
        .openModal(ConfirmationModalComponent, {
          ...{
            ...COMMON_ERROR_MODAL_PARAMS,
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
    private smev3: TimeSlotSmev3StateService,
    private modalService: ModalService,
    public constants: TimeSlotsConstants,
    private injector: Injector,
  ) {}

  endHandler: TimeSlotErrorHandler = () => {
    this.show(`${this.constants.errorInitialiseService} (${this.getErrorMessage()})`);
    return false;
  };

  handling(error: TimeSlotError, index = 0): void {
    const handler = this.errorHandlers[index];
    if (!handler) {
      this.endHandler();
    }
    const next: nextHandler = (error: TimeSlotError) => {
      this.handling(error, index + 1);
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
    this.errorHandlers.concat(handlers);
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
    if (code === 101) {
      message = `${code}: ${this.constants.error101ServiceUnavailable}`;
    }
    this.error$$.next({ type, message, code });
  }

  reset(): void {
    this.error$$.next(null);
  }
}
