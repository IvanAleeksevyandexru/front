import { Injectable } from '@angular/core';
import { ErrorInterface } from '../../typings';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { DictionaryResponseError } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../../core/services/error-handler/error-handler';
import { catchError, exhaustMap, filter } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';

export enum ErrorType {
  list,
  cancel,
  book,
  all,
}

export interface ErrorContainer {
  type: ErrorType;
  error: string;
}

export type throwErrorFunction = (
  err: ErrorInterface | DictionaryResponseError,
) => Observable<never>;

export interface ErrorTemplate {
  header: string;
  description: string;
}

export enum ErrorTypeTemplate {
  DAYS_NOT_FOUND = 'DAYS_NOT_FOUND',
}

@Injectable()
export class ErrorService {
  error$$ = new BehaviorSubject<ErrorContainer>(null);

  templates$$ = new BehaviorSubject<Record<string, ErrorTemplate>>({});
  show$$ = new Subject<null>();

  error$ = this.show$$.pipe(
    filter(() => this.hasError()),
    exhaustMap(() =>
      this.modalService
        .openModal(ConfirmationModalComponent, {
          ...{
            ...COMMON_ERROR_MODAL_PARAMS,
            buttons: [
              {
                label: 'Попробовать ещё раз',
                closeModal: true,
                value: this.getError(),
              },
            ],
          },
        })
        .pipe(catchError(() => EMPTY)),
    ),
  );

  constructor(private modalService: ModalService) {}

  getTemplates(): Record<string, ErrorTemplate> {
    return this.templates$$.getValue();
  }

  getTemplate(type: ErrorTypeTemplate): ErrorTemplate {
    return this.getTemplates()[type];
  }

  setTemplate(type: ErrorTypeTemplate, header: string, description: string): void {
    const templates = this.getTemplates();
    templates[type] = { header, description };
    this.templates$$.next(templates);
  }

  show(error?: string): void {
    if (error) {
      this.setError(ErrorType.all, error);
    }
    this.show$$.next();
  }

  getError(): string {
    return this.error$$.getValue().error;
  }
  hasError(): boolean {
    return !!this.error$$.getValue();
  }

  reset(): void {
    this.error$$.next(null);
  }

  setError(type: ErrorType, error: string): void {
    this.error$$.next({ type, error });
  }
}
