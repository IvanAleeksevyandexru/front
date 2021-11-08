import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Slot } from '../../typings';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { DatesToolsService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Injectable()
export class TimeSlotStateService {
  private progressCounter$$ = new BehaviorSubject<number>(0);

  get progress$(): Observable<boolean> {
    return this.progressCounter$$.pipe(map((counter) => counter > 0));
  }

  get loaded$(): Observable<boolean> {
    return this.progress$.pipe(map((value) => !value));
  }

  private month$$ = new BehaviorSubject<string>(null);
  get month$(): Observable<string> {
    return this.month$$.asObservable();
  }
  set month(month: string) {
    this.month$$.next(month);
  }
  get month(): string {
    return this.month$$.getValue();
  }

  private day$$ = new BehaviorSubject<Date>(null);
  get day$(): Observable<Date> {
    return this.day$$.pipe(
      distinctUntilChanged((prev, next) => this.datesTools.isEqual(prev, next)),
    );
  }
  set day(day: Date) {
    this.day$$.next(day);
  }
  get day(): Date {
    return this.day$$.getValue();
  }

  private slot$$ = new BehaviorSubject<Slot>(null);
  get slot$(): Observable<Slot> {
    return this.slot$$.asObservable();
  }
  set slot(slot: Slot) {
    this.slot$$.next(slot);
  }
  get slot(): Slot {
    return this.slot$$.getValue();
  }

  private list$$ = new BehaviorSubject<Slot[]>([]);
  get list$(): Observable<Slot[]> {
    return this.list$$.asObservable();
  }
  get list(): Slot[] {
    return this.list$$.getValue();
  }
  set list(list: Slot[]) {
    this.list$$.next(list);
  }

  private months$$ = new BehaviorSubject<string[]>([]);
  get months$(): Observable<string[]> {
    return this.months$$.asObservable();
  }
  get months(): string[] {
    return this.months$$.getValue();
  }
  set months(months: string[]) {
    this.months$$.next(months);
  }

  private additionalDisplayingButton$$ = new BehaviorSubject<boolean>(true);
  get additionalDisplayingButton$(): Observable<boolean> {
    return this.additionalDisplayingButton$$.asObservable();
  }
  get additionalDisplayingButton(): boolean {
    return this.additionalDisplayingButton$$.getValue();
  }
  set additionalDisplayingButton(additionalDisplayingButton: boolean) {
    this.additionalDisplayingButton$$.next(additionalDisplayingButton);
  }

  constructor(
    private currentAnswers: CurrentAnswersService,
    private datesTools: DatesToolsService,
    private modal: ModalService,
  ) {}

  showModal(params: ConfirmationModal): Observable<string> {
    return this.modal.openModal(ConfirmationModalComponent, {
      ...params,
    });
  }

  setAdditionalDisplayingButton(additionalDisplayingButton: boolean): void {
    this.additionalDisplayingButton = additionalDisplayingButton;
  }

  setMonth(month: string): void {
    this.month = month;
  }

  setMonths(months: string[]): void {
    this.months = months;
  }

  setList(list: Slot[]): void {
    this.list = list;
  }

  setSlot(slot: Slot): void {
    this.slot = slot;
  }

  setDay(day: Date): void {
    this.day = day;
  }

  progressStart(): void {
    this.progressCounter$$.next(this.progressCounter$$.getValue() + 1);
  }

  progressEnd(): void {
    const count = this.progressCounter$$.getValue();
    if (count > 0) {
      this.progressCounter$$.next(count - 1);
    }
  }

  clearSlot(): void {
    this.slot = null;
    this.setResult(null);
  }

  clearDay(): void {
    this.day = null;
    this.clearSlot();
  }

  setResult<T extends object>(data: T): void {
    this.currentAnswers.state = { ...data };
  }
}
