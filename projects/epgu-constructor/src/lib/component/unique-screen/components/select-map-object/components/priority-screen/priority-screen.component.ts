import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { combineLatest } from 'rxjs';
import { pluck, skip, startWith, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { DTOActionAction, KindergartenAttrs, ScreenButton } from '@epgu/epgu-constructor-types';
import { FormControl, Validators } from '@angular/forms';
import { NotifierService, NotifierType } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';

import { PriorityItemsService } from '../../services/priority-items/priority-items.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { SAVE_STEP_ACTION } from '../../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-priority-screen',
  templateUrl: './priority-screen.component.html',
  styleUrls: ['./priority-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class PriorityScreenComponent {
  @Output() showMap = new EventEmitter<DictionaryItem>();
  @Output() back = new EventEmitter<null>();

  displayCssClass$ = this.screenService.displayCssClass$;
  items$ = this.itemsService.items;
  maxKindergarten$ = this.itemsService.maxKindergarten$;
  screenItems$ = this.itemsService.screenItems;
  leftItems$ = this.itemsService.leftItems$;
  disabled$ = this.itemsService.disabled$$;
  isLoading$ = this.screenService.isLoading$;

  attrs$: Observable<KindergartenAttrs> = this.screenService.component$.pipe(
    pluck('attrs', 'mapKindergartenPriorityAttrs'),
  );

  controlCheckbox = new FormControl({ value: true, disabled: false }, Validators.required);
  notifierId = 'NOTIFIERS_CHILDREN_GARDEN';
  plural = ['сад', 'сада', 'садов'];

  finalScreen = (this.screenService.component?.arguments?.finalScreen as boolean) || false;

  buttonBase = [
    {
      label: 'Сохранить заявление',
      type: 'nextStep',
      action: DTOActionAction.getNextStep,
    } as ScreenButton,
  ];

  buttonFinalScreen = [
    {
      label: 'Продолжить',
      type: 'nextStep',
      action: DTOActionAction.getNextStep,
    } as ScreenButton,
  ];

  changes$ = combineLatest([
    // Скипаем изначальное значение BehaviorSubject чтобы избежать лишнего запроса.
    this.itemsService.items.pipe(skip(1)),
    this.controlCheckbox.valueChanges.pipe(startWith(this.controlCheckbox.value)),
  ])
    .pipe(
      tap(([items, otherKindergarten]) => {
        this.currentAnswersService.state = {
          otherKindergarten,
          items,
        };
        this.actionService.switchAction(SAVE_STEP_ACTION);
      }),
      takeUntil(this.unsubscribeService.ngUnsubscribe$),
    )
    .subscribe();

  constructor(
    public itemsService: PriorityItemsService,
    public screenService: ScreenService,
    public notify: NotifierService,
    public unsubscribeService: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
    private actionService: ActionService,
  ) {}

  backAction(): void {
    this.back.emit();
  }

  showAction(item: DictionaryItem): void {
    this.showMap.emit(item);
  }
  upAction(index: number): void {
    this.itemsService.raise(index);
  }
  downAction(index: number): void {
    this.itemsService.lower(index);
  }

  deleteAction(item: DictionaryItem): void {
    const context = this.itemsService.remove(item);
    if (context.index === -1) {
      return;
    }

    this.notify.success({
      type: NotifierType.Success,
      message: 'Сад убран из списка',
      onCancel: () => this.itemsService.cancel(context),
      notifierId: this.notifierId,
    });
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.backAction();
    }
  }

  rollUpAction(): void {
    this.itemsService.reset();
  }

  moreAction(): void {
    this.itemsService.more();
  }
}
